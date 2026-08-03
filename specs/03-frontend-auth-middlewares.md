# SPEC 03 — Autenticación frontend y middlewares de ruta

> **Estado:** Implemented · **Depende de:** — · **Fecha:** 2026-06-13
> **Objetivo:** Conectar login y logout reales (POST /login, POST /logout) mediante un AuthProvider global y dos middlewares de ruta (AuthMiddleware/GuestMiddleware) que protegen el dashboard y la pantalla de login, usando location.state para retomar la ruta intentada tras autenticar.

---

## 1 — Por qué existe este spec

El módulo `auth` tiene andamiaje pero no funciona: el contrato del repositorio se
exporta como `AuthRepository` en `domain/` pero se importa como `UserRepository`
(rompe `tsc`), el DTO asume `access_token`/`user.id` cuando la API real devuelve
`token`/`user.uuid`/`username`, el endpoint apunta a `/auth/login` en vez de `/login`,
`HttpDataSource.post<T>` no hace `await` (castea la promesa), y `useAuthService` es un
stub vacío. Además no hay guardas de ruta: cualquiera entra a `/dashboard`.

Este spec deja la sesión funcionando de punta a punta: base de red mínima
(`VITE_API_URL` + interceptor de token), login y logout reales, estado global de auth
y dos middlewares de ruta.

**Relación con SPEC 04:** SPEC 04 planeó la misma base de red (`.env`, `api.config.ts`,
interceptor de token) pero quedó en Borrador sin implementar. Este spec la implementa;
cuando SPEC 04 se ejecute, esa base ya existirá.

---

## 2 — Alcance

**Dentro:**

- **Base de red mínima (compartida):**
  - Crear `.env` con `VITE_API_URL=http://localhost:8000/api/v1`.
  - Tipar `import.meta.env.VITE_API_URL` en `src/vite-env.d.ts`.
  - Crear `src/modules/shared/infraestructure/config/api.config.ts`
    (`API_BASE_URL` lee `VITE_API_URL` con fallback).
  - `HttpDataSource`: arreglar `post<T>` (async, devuelve `response.data` tipado),
    `get<T>` tipado, y añadir interceptor de request que adjunta
    `Authorization: Bearer {token}` leyendo `access_token` vía `StorageService`.

- **Login real (POST /login):**
  - Campo único `identifier` (email/teléfono/username) + `password`.
  - DTOs corregidos a la API real: request `{ identifier, password }`,
    response `{ user: { uuid, name, username, email, phone }, token }`.
  - Entidad `User` actualizada (`uuid`, `name`, `username`, `email`, `phone`).
  - Manejo de error 422: mostrar el mensaje "Las credenciales proporcionadas son
    incorrectas." inline en el formulario, sin revelar qué campo falló.
  - Estado de carga en el botón durante la petición.

- **Logout real (POST /logout):**
  - `logout()` llama POST /logout best-effort; pase lo que pase limpia
    `access_token` + `auth_user` del storage y del context, y redirige al login.
  - Acción de salida en el `SidebarUserCard`.

- **Estado global de auth (AuthProvider):**
  - Provider con `useReducer` que expone `{ user, isAuthenticated, login, logout }`.
  - Persistencia en localStorage: `access_token` y `auth_user`; rehidratación al
    cargar la app (no hay endpoint /me).
  - `useAuth()` reemplaza el stub `useAuthService`.
  - Conectar `SidebarUserCard` al `user` del context (en vez del `DEFAULT_USER`).

- **Middlewares de ruta (guardas):**
  - `AuthMiddleware`: si no hay sesión, `<Navigate to="/" state={{ from }} replace />`;
    si la hay, `<Outlet />`. Envuelve el subtree de `AppLayout`.
  - `GuestMiddleware`: si hay sesión, `<Navigate>` a `state.from` (fallback
    `/dashboard`); si no, `<Outlet />`. Envuelve la ruta `/` (login).
  - Tras login exitoso, navegar a `state.from` (fallback `/dashboard`).
  - Reestructurar `app.router.tsx`: layout raíz con `<AuthProvider>`, rama guest
    para `/`, rama auth para `AppLayout`.

- **Capa DDD del módulo `auth` (arreglada y coherente):**
  - Contrato `AuthRepository` (domain) con `login()` y `logout()`.
  - Modelo de sesión `AuthSession { user, token }`.
  - `auth.usecase.ts`, repositorio de infraestructura, mapper y DTOs alineados al
    contrato y a la API real.

**Fuera de alcance (para specs futuros):**

- **trust-client** (POST /trust-client, +7 días): "mantener sesión / dispositivo de
  confianza". Spec aparte.
- **forgot-password / reset-password**: flujo de recuperación con página pública
  `/reset-password` y query firmada (`expires`, `signature`). Spec aparte.
- **Endpoint /me / refresh de usuario**: no existe en la doc; la rehidratación se hace
  desde localStorage.
- **Botones sociales (Google/Microsoft)**: quedan decorativos/inertes, sin OAuth.
- **Campo `role` real del usuario**: la API no devuelve rol; el `SidebarUserCard`
  mantiene su rol estático/derivado.
- **Registro ("Solicitar acceso")**: el enlace queda inerte.
- **Refresh automático de token / manejo global de 401** (logout forzado al expirar):
  spec aparte; aquí solo se adjunta el token.

---

## 3 — Modelo de datos

### DTOs (forma cruda de la API)

```ts
// src/modules/auth/infraestructure/dto/login.request.dto.ts
export interface LoginRequestDto {
  identifier: string // email, teléfono o username
  password: string
}

// src/modules/auth/infraestructure/dto/login.response.dto.ts
// (renombra el archivo con typo `ogin.response.dto.ts`)
export interface LoginResponseDto {
  user: {
    uuid: string
    name: string
    username: string
    email: string
    phone: string
  }
  token: string
}

// Logout no necesita DTO de request; la respuesta { message } se ignora.
```

### Entidad de dominio

```ts
// src/modules/auth/domain/user.entity.ts  (se corrige id→uuid, +username)
export class User {
  constructor(
    private readonly uuid: string,
    private email: string,
    private name: string,
    private username: string,
    private phone: string,
  ) {}
  // create / fromPrimitives / toPrimitives con { uuid, email, name, username, phone }
}
```

### Modelo de sesión (dominio)

```ts
// src/modules/auth/domain/auth-session.model.ts
export interface AuthSession {
  user: User
  token: string
}
```

### Contrato del repositorio (dominio)

```ts
// src/modules/auth/domain/auth.repository.ts  (un solo nombre: AuthRepository)
export interface AuthRepository {
  login(identifier: string, password: string): Promise<AuthSession>
  logout(): Promise<void>
}
```

### Estado del AuthProvider (useReducer)

```ts
// src/modules/auth/application/auth-state.model.ts
export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error'

export interface AuthState {
  user: User | null
  token: string | null
  status: AuthStatus
  error: string | null
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthSession }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
```

Valor expuesto por el context: `{ user, isAuthenticated, status, error, login, logout }`
(`isAuthenticated = token !== null`).

### Persistencia (localStorage, vía StorageService)

| Clave          | Contenido                | Cuándo se escribe / borra      |
| -------------- | ------------------------ | ------------------------------ |
| `access_token` | `string` (token Sanctum) | set en login, remove en logout |
| `auth_user`    | `User.toPrimitives()`    | set en login, remove en logout |

Una clase con SRP encapsula las dos claves:

```ts
// src/modules/auth/infraestructure/storage/auth-session.storage.ts
export class AuthSessionStorage {
  static save(session: AuthSession): void // set access_token + auth_user
  static read(): AuthSession | null // rehidrata al cargar la app
  static clear(): void // remove ambas claves
}
```

### Estado de navegación (ruta intentada)

```ts
// payload de location.state al redirigir a login
interface FromLocationState {
  from?: { pathname: string } // ruta protegida que se intentó abrir
}
```

- `AuthMiddleware` redirige con `<Navigate to="/" state={{ from: location }} replace />`.
- Tras login y en `GuestMiddleware`, el destino es `state.from?.pathname ?? '/dashboard'`.

### Estructura del router (app.router.tsx)

```text
/ (layout raíz: <AuthProvider><Outlet/></AuthProvider>)
├── <GuestMiddleware/>              → Outlet
│   └── path '/'        → <AuthPage/>
└── <AuthMiddleware/>               → Outlet
    └── <AppLayout/>
        ├── path 'dashboard' → DashboardPanelPage
        ├── path 'tools'     → ToolsPage
        └── path '*'         → ComingSoonPage
```

### Rutas relativas (base `VITE_API_URL` = `http://localhost:8000/api/v1`)

- `POST /login` → body `{ identifier, password }` → `{ user, token }`
- `POST /logout` → sin body → `{ message }` (se ignora)

Notas:

- La entidad `User` no tiene `role` (la API no lo da); el `SidebarUserCard` mantiene un
  rol estático.
- El interceptor de `HttpDataSource` ya adjunta el `Authorization: Bearer` leyendo
  `access_token`, así que `POST /logout` viaja autenticado sin código extra.

---

## 4 — Plan de implementación

1. **Config de red.** Crear `.env` con `VITE_API_URL=http://localhost:8000/api/v1`;
   tipar la variable en `src/vite-env.d.ts` (`interface ImportMetaEnv`); crear
   `src/modules/shared/infraestructure/config/api.config.ts`
   (`export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'`).
   Verificación: `npx tsc -b` sin errores nuevos.

2. **HttpDataSource: token + métodos tipados.** Añadir interceptor de request que
   adjunta `Authorization: Bearer {token}` leyendo `access_token` vía `StorageService`;
   cambiar `get<T>(url): Promise<T>` y `post<T>(url, body): Promise<T>` para hacer
   `await` y devolver `response.data`. Verificación: `tsc -b` limpio.

3. **Dominio.** Corregir `user.entity.ts` (`id`→`uuid`, añadir `username`); crear
   `domain/auth-session.model.ts` (`AuthSession { user, token }`); reescribir
   `domain/auth.repository.ts` con un solo contrato `AuthRepository`
   (`login(identifier, password)`, `logout()`). Eliminar el nombre `UserRepository`.

4. **DTOs.** Reescribir `login.request.dto.ts` (`{ identifier, password }`); renombrar
   `ogin.response.dto.ts`→`login.response.dto.ts` con la forma real
   (`{ user: { uuid, name, username, email, phone }, token }`); actualizar imports.

5. **Mapper.** Actualizar `auth.mapper.ts`: `toUserEntity(dto.user)` (uuid/username) y
   `toAuthSession(dto)` (`{ user, token }`).

6. **Storage de sesión.** Crear
   `infraestructure/storage/auth-session.storage.ts` (`AuthSessionStorage` con
   `save`/`read`/`clear` sobre `access_token` + `auth_user`).

7. **Repositorio.** Reescribir `infraestructure/repositories/auth.repository.ts`
   implementando `AuthRepository`: `POST /login` → `toAuthSession`; `POST /logout`
   best-effort (try/catch que no propaga); `handleApiError` en login. Exportar
   singleton `authRepository` con `new HttpDataSource(API_BASE_URL)` a nivel módulo.
   Quitar el `StorageService.set` de aquí (la persistencia vive en el use case).

8. **Use case.** Actualizar `application/auth.usecase.ts`: `login(identifier, password)`
   llama al repo y persiste vía `AuthSessionStorage.save`, devuelve `AuthSession`;
   `logout()` llama al repo y hace `AuthSessionStorage.clear()`.

9. **Reducer.** Crear `application/auth-state.model.ts` (`AuthState`, `AuthAction`) y
   `application/auth.reducer.ts` (maneja `AUTH_START/SUCCESS/ERROR/LOGOUT`).

10. **AuthProvider + useAuth.** Crear `infraestructure/providers/auth.provider.tsx`
    (context + `useReducer`, estado inicial rehidratado con `AuthSessionStorage.read()`,
    métodos `login`/`logout` que despachan acciones); crear `hooks/use-auth.hook.ts`
    (`useAuth()` consume el context). Borrar el stub `hooks/use-auth.service.ts`.

11. **Middlewares.** Crear `infraestructure/middlewares/auth.middleware.tsx`
    (`AuthMiddleware`: sin sesión → `<Navigate to="/" state={{ from: location }} replace />`,
    con sesión → `<Outlet />`) y `guest.middleware.tsx` (`GuestMiddleware`: con sesión →
    `<Navigate to={state.from?.pathname ?? '/dashboard'} replace />`, sin sesión →
    `<Outlet />`). Ambos leen `useAuth()` y `useLocation()`.

12. **Router.** Reestructurar `app.router.tsx`: layout raíz
    `{ element: <AuthProvider><Outlet/></AuthProvider>, children: [...] }`; rama
    `{ element: <GuestMiddleware/>, children: [{ path: '/', element: <AuthPage/> }] }`;
    rama `{ element: <AuthMiddleware/>, children: [{ Component: AppLayout, children:
[dashboard, tools, *] }] }`. Verificación: navegar a `/dashboard` sin token redirige
    a `/`.

13. **Formulario.** Conectar `auth-form.component.tsx`: campo único `identifier`,
    `useAuth().login()` en submit, estado de carga en el botón, render del mensaje 422
    inline (`status === 'error'`), y `navigate(state.from?.pathname ?? '/dashboard')`
    al éxito. Botones sociales y "Solicitar acceso" quedan inertes.

14. **Sidebar + logout.** En `sidebar.component.tsx` leer `user` de `useAuth()` (quitar
    `DEFAULT_USER` como fuente); en `sidebar-user-card.component.tsx` añadir la acción de
    salida que llama `logout()` y redirige a `/`.

15. **Verificación.** `npx tsc -b`, `npx eslint` y `npx vite build` sin errores nuevos.
    Prueba manual con la API arriba (credenciales `admin`/`password`): login exitoso
    redirige al dashboard; recargar mantiene la sesión; entrar a `/tools` sin token
    rebota a `/` y tras login vuelve a `/tools`; un usuario logeado en `/` rebota a
    `/dashboard`; credenciales malas muestran el 422 inline; logout limpia y vuelve al
    login.

---

## 5 — Criterios de aceptación

- [ ] Existe `.env` con `VITE_API_URL` y `api.config.ts` la lee con fallback a
      `http://localhost:8000/api/v1`.
- [ ] `HttpDataSource.post<T>` y `get<T>` hacen `await` y devuelven `response.data`
      tipado (ya no castean la promesa).
- [ ] Toda petición de `HttpDataSource` envía `Authorization: Bearer {token}` cuando
      hay `access_token` en localStorage.
- [ ] `POST /login` con `identifier` (email/teléfono/username) + `password` correctos
      responde 200, guarda `access_token` y `auth_user`, y redirige al dashboard.
- [ ] Tras un login exitoso, recargar la página mantiene la sesión (rehidrata desde
      localStorage) sin volver al login.
- [ ] Entrar a una ruta protegida (`/dashboard`, `/tools`) sin sesión redirige a `/`
      guardando la ruta intentada en `location.state.from`.
- [ ] Tras autenticar desde ese rebote, la app navega a la ruta intentada original
      (no siempre a `/dashboard`).
- [ ] Un usuario autenticado que entra a `/` es redirigido a `/dashboard` (o a
      `state.from` si existe) por el `GuestMiddleware`.
- [ ] Credenciales inválidas (422) muestran "Las credenciales proporcionadas son
      incorrectas." inline en el formulario, sin revelar qué campo falló.
- [ ] Durante la petición de login el botón muestra estado de carga y no permite
      reenvíos.
- [ ] El `SidebarUserCard` muestra el `name` del usuario autenticado (no el
      `DEFAULT_USER` fijo).
- [ ] La acción de salida del `SidebarUserCard` llama `POST /logout`, limpia
      `access_token` + `auth_user` y redirige a `/`, incluso si la llamada al endpoint
      falla.
- [ ] El contrato de dominio se llama `AuthRepository` en todos los imports (ya no
      existe el `UserRepository` que rompía `tsc`).
- [ ] `npx tsc -b`, `npx eslint` y `npx vite build` compilan sin errores nuevos.

---

## 6 — Decisiones tomadas y descartadas

- **Sí:** Incluir la base de red (`.env`, `api.config.ts`, interceptor de token, arreglo
  de `post<T>`) en este spec. El login necesita un POST funcional ahora; SPEC 04 la
  planeó pero quedó sin implementar. Auth queda autosuficiente.
- **No:** Depender de SPEC 04 para la base de red. SPEC 04 sigue en Borrador; bloquear
  auth tras él lo dejaría inerte.

- **Sí:** Persistir la ruta intentada en `location.state` de React Router
  (`<Navigate state={{ from }} />` + `navigate(from)`). Idiomático, sobrevive el
  ida-y-vuelta del redirect y no ensucia el storage.
- **No:** Guardar la ruta en localStorage o en el AuthContext. localStorage mezcla
  navegación con persistencia y cuesta limpiar; el campo en context se pierde en un
  reload completo.

- **Sí:** Clave de storage `access_token` (no `auth_token` del prompt). Alinea con el
  interceptor que SPEC 04 ya había definido y evita dos claves para lo mismo.
- **Sí:** Corregir DTO/mapper/entidad a la forma real de la API (`token`, `user.uuid`,
  `username`). El DTO previo (`access_token`, `user.id`) no coincidía con la respuesta y
  rompería el mapeo en runtime.

- **Sí:** `AuthProvider` con `useReducer` como única fuente de verdad
  (`{ user, isAuthenticated, login, logout }`). Los middlewares y el sidebar leen de un
  solo lugar; respeta la regla de `useReducer` para estados relacionados (CLAUDE.md #2).
- **No:** Leer el token de localStorage en cada guarda por separado. Repartiría la
  lógica y dejaría al sidebar sin acceso al `user`.

- **Sí:** Mantener el login en `/` y montar `GuestMiddleware` sobre esa ruta. Cambios
  mínimos al router actual; el `AuthForm` ya apuntaba a `/`.
- **No:** Mover el login a `/login` con `/` redirigiendo. Más limpio a futuro, pero
  reescribe rutas que hoy funcionan sin ganancia inmediata.

- **Sí:** Rehidratar la sesión persistiendo `auth_user` junto al token. No hay endpoint
  `/me`; sin el user persistido el sidebar quedaría vacío tras recargar.
- **No:** Persistir solo el token y esperar un `/me`. Ese endpoint no existe en la doc.

- **Sí:** Logout que llama `POST /logout` best-effort y limpia local pase lo que pase.
  Si el token ya expiró o no hay red, el usuario igual cierra sesión y no queda atrapado.
- **No:** Exigir 200 de `/logout` antes de limpiar. Un fallo de red dejaría la sesión
  local colgada.

- **Sí:** Diferir `trust-client` y `forgot/reset-password` a specs propios. Cada uno
  suma UX, rutas o estados que no son esenciales al login; mantienen este spec enfocado.
- **No:** Meter el flujo de recuperación aquí. Tiene página pública con query firmada,
  throttle y error 403 propios — es otra unidad de trabajo.

- **No:** Manejo global de 401 (logout forzado al expirar el token) ni refresh
  automático. El interceptor solo adjunta el token; expulsar al expirar va en otro spec.

---

## 7 — Riesgos identificados

| Riesgo                                                                                                                                                                 | Mitigación                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthProvider` usa `useNavigate`/`useLocation`, que solo funcionan dentro de `RouterProvider`. Montarlo en `main.tsx` (fuera del router) rompería en runtime.          | Montar `AuthProvider` como elemento del **layout raíz** dentro de `app.router.tsx`, no en `main.tsx`. Los middlewares y el form quedan bajo el router.                                                                 |
| `StorageService` guarda con `JSON.stringify`. Si se rehidrata un valor escrito a mano "en crudo" (sin comillas) en localStorage, `JSON.parse` falla y tira `AppError`. | `AuthSessionStorage.read()` envuelve la lectura: ante parseo inválido limpia la sesión y devuelve `null` (estado no autenticado) en vez de romper el arranque.                                                         |
| Pérdida de `location.state.from` en un reload completo dentro del login: el usuario fue rebotado, recarga `/` y `state` se vacía.                                      | Es aceptable: sin `from`, el destino tras login cae al fallback `/dashboard`. No se rompe nada, solo no retoma la ruta original en ese caso límite.                                                                    |
| `handleApiError` lanza strings (`'UnauthorizedError'`) para 401 y `ApiError` para 422; mezclar tipos complica leer el mensaje.                                         | El `login` del repo solo necesita el mensaje del 422 (`ApiError.message`); el provider captura y guarda `error.message ?? 'Error de autenticación'` en `state.error`. El 401 en login no aplica (login es ruta guest). |
| API local apagada o CORS en dev: el login no responde.                                                                                                                 | El form muestra el estado de error con el mensaje del catch; la pantalla no se rompe, el usuario puede reintentar.                                                                                                     |
| `POST /logout` con token ya expirado responde 401.                                                                                                                     | El logout es best-effort dentro de try/catch; el 401 se ignora y la sesión local se limpia igual.                                                                                                                      |

---

## Lo que **no** está en este spec

- **trust-client** (+7 días, "mantener sesión / dispositivo de confianza").
- **forgot-password / reset-password** (flujo de recuperación con página pública
  `/reset-password` y query firmada).
- **Manejo global de 401 / logout forzado al expirar el token y refresh automático.**
- **Endpoint `/me`** o refresh del usuario desde el servidor (la rehidratación es local).
- **OAuth de Google/Microsoft** (los botones quedan decorativos).
- **Registro de usuarios** ("Solicitar acceso" queda inerte).

Cada uno, si aterriza, va en su propio spec.
