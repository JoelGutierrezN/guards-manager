# SPEC 05 — Manejo global de sesión expirada (401)

> **Estado:** Implementado · **Depende de:** SPEC 03 · **Fecha:** 2026-07-20 · **Implementado:** 2026-07-21
> **Objetivo:** Cuando cualquier petición a la API responde 401, el front cierra la sesión localmente, redirige sin recargar a una pantalla `/session-expired` guardando la ruta que se intentaba usar, y al reautenticar retoma esa ruta original.

---

## Alcance

**Dentro:**

- **`HttpDataSource` como singleton:** patrón `getInstance()` (constructor privado); reemplaza las 3 instancias propias (`authRepository`, `inventoryRepository`, `brandRepository`) que hoy hacen cada una `new HttpDataSource(API_BASE_URL)`.
- **`handle-api-error.ts` → hook `useHandleApiError()`:** se monta una sola vez dentro de `AuthProvider`; usa `useNavigate()` y el `dispatch` del reducer de auth ya existentes ahí. El caso 401 deja de solo `throw 'UnauthorizedError'` y en su lugar:
  1. Limpia `AuthSessionStorage` (`access_token` + `auth_user`).
  2. Despacha `AUTH_LOGOUT` sobre el reducer de `AuthProvider`.
  3. Navega (sin reload) a `/session-expired` con `state: { from: <ruta actual, pathname+search> }`.
  4. Guard para que, si hay varias peticiones 401 concurrentes, solo la primera dispare el paso 1-3 (idempotencia).
- **Aplica a toda petición** hecha con `HttpDataSource`, incluida `POST /logout`: si el token ya venció, el mismo flujo de arriba se ejecuta (se elimina el catch silencioso que hoy ignora el error ahí).
- **Ruta pública `/session-expired`:** fuera de `AuthMiddleware`/`GuestMiddleware`. Si se entra sin `location.state.from` (acceso directo por URL), redirige a `/`.
- **Página `SessionExpiredPage`:** nueva, inspirada en el lenguaje visual del mock de referencia (eyebrow, ícono `LockIcon` en badge, título, cuerpo, botón primario "Iniciar sesión"). No es un componente multi-variante 404/403/500, solo esta pantalla.
- **Botón "Iniciar sesión"** navega a `/` con `state: { from }`, reutilizando el mecanismo ya existente de `GuestMiddleware`/`AuthForm` (SPEC 03) para retomar la ruta original tras autenticar.
- **Limpieza:** eliminar la instanciación repetida de `HttpDataSource` en los 3 repositorios; no quedan archivos huérfanos tras el cambio (se reescriben, no se duplican).

**Fuera de alcance (para specs futuros):**

- Toast global de sesión expirada (se descartó a favor de la pantalla dedicada).
- Componente genérico multi-variante de pantallas de error (404/403/500) inspirado en el mock — esta spec solo cubre 401/sesión expirada.
- Refresh automático de token / renovación silenciosa antes de que expire.
- Tipar los otros casos de `handleApiError` (500, error genérico) como clases de error en vez de strings (`'InternalServerError'`, `'UnexpectedError'`) — se deja igual, no se toca en este spec.

---

## Modelo de datos

```ts
// src/modules/shared/infraestructure/datasource/http.datasource.ts
export class HttpDataSource {
  private static instance: HttpDataSource | null = null
  private readonly client: AxiosInstance

  private constructor(baseURL: string) { /* ...igual que hoy... */ }

  static getInstance(): HttpDataSource {
    if (!HttpDataSource.instance) {
      HttpDataSource.instance = new HttpDataSource(API_BASE_URL)
    }
    return HttpDataSource.instance
  }
}
```

```ts
// src/modules/shared/infraestructure/errors/use-handle-api-error.hook.ts
// Reemplaza a handle-api-error.ts (se elimina el archivo actual)
export function useHandleApiError(): (error: unknown) => never {
  const navigate = useNavigate()
  const { dispatch } = useAuth() // o logout() expuesto por el context

  return function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // limpia sesión, dispatch AUTH_LOGOUT, navigate('/session-expired', { state: { from } })
      // solo una vez (guard interno)
    }
    // resto de casos (422, 500, default) igual que hoy
  }
}
```

```ts
// src/modules/auth/infraestructure/from-location-state.interfaces.ts (ya existe, se reutiliza)
export interface FromLocationState {
  from?: { pathname: string; search?: string }  // se añade `search` para no perder query params
}
```

Notas:

- `AuthAction` y `authReducer` **no cambian**: `AUTH_LOGOUT` ya existe y hace exactamente lo necesario (`{ user: null, token: null, status: 'idle', error: null }`).
- No se introduce ningún estado nuevo persistido; `/session-expired` no guarda nada en localStorage, solo lee `location.state`.
- El guard de "solo la primera vez" es una bandera en memoria (closure/`useRef`/módulo), no persistida — se resetea en cada `login()` exitoso.

---

## Plan de implementación

1. **`HttpDataSource` a singleton.** Constructor privado + `static getInstance()`. Verificación: `npx tsc -b` sin errores nuevos (el resto del código aún no lo usa, sigue compilando).

2. **Actualizar los 3 repositorios.** En `auth.repository.ts`, `inventory.repository.ts` y `brand.repository.ts`, reemplazar `new HttpDataSource(API_BASE_URL)` por `HttpDataSource.getInstance()`. Verificación: `tsc -b` limpio, la app sigue funcionando igual (login, tools, brands).

3. **Hook `useHandleApiError`.** Crear `src/modules/shared/infraestructure/errors/use-handle-api-error.hook.ts`; mantiene el `switch` actual (422/500/default) igual que hoy, pero el caso 401 todavía no hace nada nuevo (placeholder). Eliminar `handle-api-error.ts` y actualizar los 3 imports en los repositorios — pero como el hook no puede llamarse dentro de una clase plana, este paso también decide **dónde** se invoca: los repositorios dejan de llamar `handleApiError` directamente en su `catch`; en su lugar, cada método del repositorio re-lanza el error crudo, y quien llama al repositorio (los hooks de aplicación: `useAuth`/`AuthProvider.login`, `useInventoryOverview`, futuros hooks de brands) usa `useHandleApiError()` en su propio `catch`. Verificación: `tsc -b` limpio.

4. **Estado de sesión expirada (guard + limpieza).** Dentro de `useHandleApiError`, implementar el caso 401: `AuthSessionStorage.clear()`, `dispatch({ type: 'AUTH_LOGOUT' })` (recibido como parámetro o vía `useAuth()`), `navigate('/session-expired', { state: { from: { pathname: location.pathname, search: location.search } } })`, con guard de una sola ejecución (`useRef` a nivel de `AuthProvider` o módulo). Verificación manual: forzar un 401 (token inválido a mano en localStorage) y llamar cualquier endpoint protegido.

5. **`AuthUseCase.logout()` y `auth.repository.ts`.** Quitar el catch silencioso de `POST /logout`; dejar que el error fluya para que, si es 401, dispare el mismo flujo del paso 4 en vez de ignorarse.

6. **`FromLocationState`.** Añadir `search?: string` a la interfaz existente; actualizar `AuthMiddleware`, `GuestMiddleware` y `AuthForm` para propagar `search` donde arman `state.from` (no rompe lo existente, solo completa el dato).

7. **Ruta `/session-expired`.** Crear `session-expired.page.tsx` en `shared/infraestructure/pages/` con un guard inline: si `location.state?.from` es `undefined`, `<Navigate to="/" replace />`; si existe, renderiza la pantalla. Registrar la ruta en `app.router.tsx` como hija del layout raíz (fuera de `AuthMiddleware`/`GuestMiddleware`).

8. **`SessionExpiredPage` (UI).** Construir la pantalla: eyebrow, badge con `LockIcon` (Hugeicons), título "Tu sesión expiró", cuerpo, botón primario "Iniciar sesión" que hace `navigate('/', { state: { from } })`. Verificación manual visual.

9. **Verificación final.** `npx tsc -b`, `npx eslint`, `npx vite build` sin errores nuevos. Prueba manual: iniciar sesión, forzar 401 (token corrupto en un endpoint), confirmar que redirige a `/session-expired` sin perder el estado de la SPA (sin flash de recarga), reautenticar y confirmar que vuelve a la ruta original; entrar a `/session-expired` directo por URL y confirmar que rebota a `/`.

---

## Criterios de aceptación

- [x] `HttpDataSource` expone `getInstance()` y ya no tiene constructor público; los 3 repositorios (`auth`, `inventory`, `brand`) lo usan en vez de crear su propia instancia.
- [x] Ante una respuesta 401 de **cualquier** endpoint (mientras hay sesión activa), la app limpia `access_token` y `auth_user` de `localStorage`.
- [x] Ante ese mismo 401, el `AuthContext` pasa a `isAuthenticated: false` sin necesidad de recargar la página.
- [x] La navegación a `/session-expired` ocurre **sin** un full reload (no hay parpadeo/recarga de la SPA).
- [x] Al navegar a `/session-expired`, `location.state.from` contiene la ruta (`pathname` + `search`) donde estaba el usuario cuando ocurrió el 401.
- [x] Si dos peticiones en paralelo devuelven 401 al mismo tiempo, solo se ejecuta una limpieza/navegación (no hay doble redirect ni doble dispatch).
- [x] `POST /logout` con un token ya expirado también dispara este flujo (ya no se ignora silenciosamente el 401 ahí).
- [x] La pantalla `/session-expired` muestra un ícono `LockIcon`, un mensaje de sesión expirada y un botón "Iniciar sesión".
- [x] El botón "Iniciar sesión" navega a `/` conservando `state.from`.
- [x] Tras reautenticar exitosamente desde ahí, la app navega a la ruta original (`state.from.pathname` + `search`), no siempre a `/dashboard`.
- [x] Acceder a `/session-expired` directamente por URL (sin `location.state.from`) redirige a `/`.
- [x] `npx tsc -b`, `npx eslint` y `npx vite build` compilan sin errores nuevos.

---

## Implementación final (as-built)

Durante la implementación, el usuario revirtió explícitamente la decisión de manejar el 401 con un hook por llamador (`useHandleApiError`), a favor de un **interceptor de respuesta de axios** centralizado: "el manejo del 401 debe estar siempre escuchando en todas las peticiones, sin repetirlo en cada endpoint". La arquitectura final difiere del plan original en los pasos 3-5:

- **`HttpDataSource`** (singleton, `getInstance()` lee `API_BASE_URL` internamente) tiene un **interceptor de respuesta**: ante cualquier 401 notifica vía un handler inyectable (`setUnauthorizedHandler`) y re-lanza el error. No conoce React ni navega.
- **`AuthProvider`** inyecta el handler en un `useEffect`. El handler **no navega**: si hay sesión activa en memoria (`authenticatedRef`, espejo síncrono de `state.token !== null`, que también actúa como guard de una sola ejecución para 401 concurrentes), limpia `AuthSessionStorage` y despacha la acción nueva **`AUTH_SESSION_EXPIRED`** (`sessionExpired: true` en `AuthState`).
- **`AuthMiddleware`** es la **única fuente de navegación** (enfoque declarativo, sin carrera de redirects): si `!isAuthenticated`, redirige a `/session-expired` cuando `sessionExpired` es `true`, o a `/` en caso contrario — siempre con `state.from = { pathname, search }`. Los intentos previos con `navigate()` imperativo desde el handler perdían la carrera contra el propio middleware.
- **No existen** `useHandleApiError` ni `handle-api-error.ts` (eliminado). Los repositorios re-lanzan el error crudo y los hooks llamadores usan `try/catch` simple con sus errores locales; los errores personalizados (`ApiError`) quedan disponibles para cuando se necesiten.
- **`FromLocationHelper.resolvePath(state)`** (nuevo helper en `auth/infraestructure/`) centraliza `pathname + search ?? '/dashboard'`; lo usan `GuestMiddleware` y `AuthForm`.
- La bandera `sessionExpired` se resetea en `AUTH_START`, `AUTH_SUCCESS` y `AUTH_LOGOUT`; el 401 de un login con credenciales inválidas no dispara el flujo (no hay sesión activa en memoria).
- Límite conocido y aceptado: si el token desaparece y se hace **carga en frío** (F5), no hay sesión en memoria que expire — se llega al login por `AuthMiddleware`, no a `/session-expired`.

---

## Decisiones tomadas y descartadas

- **Sí:** `HttpDataSource` como singleton (`getInstance()`). Elimina la duplicación de `new HttpDataSource(API_BASE_URL)` en 3 repositorios (regla DRY de CLAUDE.md) y da un solo punto de entrada consistente.
- **No:** Mantener instancias por repositorio. Multiplicaría cualquier lógica futura de interceptores y ya era código repetido sin razón (todas usan la misma `API_BASE_URL`).

- ~~**Sí:** Convertir `handleApiError` en un hook (`useHandleApiError`) invocado desde los hooks de aplicación (no desde las clases de repositorio).~~ **Revertido durante la implementación** (ver "Implementación final"): obligaba a repetir el manejo en cada llamador; el usuario pidió centralizarlo.
- **No:** Un servicio con `EventTarget`/pub-sub para desacoplar el interceptor de axios de React. Es una capa extra de indirección que el propio usuario descartó por "mucha vuelta".
- ~~**No:** Interceptor de respuesta de axios dentro de `HttpDataSource`.~~ **Revertido durante la implementación**: es exactamente lo que se construyó (interceptor + handler inyectado por `AuthProvider`), por petición explícita del usuario.

- **Sí:** Pantalla dedicada `/session-expired` en vez de un toast global. Menos piezas nuevas (no hay que introducir un sistema de toasts global, hoy `useToasts` es local por componente) y da espacio para explicar la situación con más contexto.
- **No:** Toast global de sesión expirada. Queda fuera de alcance; se puede retomar si aparece la necesidad de notificaciones globales para otros casos.

- **Sí:** Guardar `/session-expired` con un guard basado en `location.state.from` (si no existe, redirige a `/`). Reutiliza el mismo patrón que ya usan `AuthMiddleware`/`GuestMiddleware`, sin inventar tokens firmados de un solo uso.
- **No:** Ruta firmada/de un solo uso para `/session-expired`. Sobre-ingeniería para una pantalla informativa; el guard por `state` ya evita el acceso directo casual.

- **Sí:** Redirección sin full reload (`navigate` imperativo vía React Router), preservando el estado de la SPA. Requisito explícito del usuario para no perder estados de la app.
- **No:** `window.location.href = '/session-expired'`. Provocaría una recarga completa y perdería cualquier estado en memoria de otras partes de la app.

- **Sí:** Aplicar el mismo flujo también a `POST /logout` cuando el token ya venció, quitando el catch silencioso actual. "Si el token vence, vence y punto" — no tiene sentido tratar ese 401 distinto al de cualquier otro endpoint.
- **No:** Mantener el logout 100% best-effort/silencioso. Ya no aplica porque el flujo de 401 ahora limpia y redirige de forma centralizada; el try/catch silencioso quedaría redundante.

- **Sí:** Guard de una sola ejecución para 401 concurrentes (varias peticiones en paralelo no disparan múltiples limpiezas/redirects).
- **No:** Dejar que cada 401 dispare su propio ciclo completo. El usuario fue explícito: "una vez que suceda ya venció el token, no hay más".

- **No:** Generalizar `SessionExpiredPage` a un componente multi-variante de errores (404/403/500) inspirado en el mock de referencia. Es una idea con valor, pero expande el alcance de este spec; queda anotada para un spec futuro si se decide construir esas pantallas.

---

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Mover el manejo de 401 de los repositorios (que capturaban todo con `handleApiError`) a los hooks llamadores puede dejar algún `catch` sin actualizar y tragarse el error silenciosamente. | El paso 3 del plan revisa explícitamente los 3 puntos de llamada actuales (`AuthProvider.login`, `AuthUseCase.logout`, `useInventoryOverview`) y cualquier otro hook que use `brandRepository`; `tsc -b` no detecta esto por tipos, así que se verifica manualmente forzando un 401 en cada flujo. |
| El guard "solo una vez" mal implementado (ej. con estado de React en vez de `useRef`/módulo) podría re-disparar el flujo en un re-render y causar un loop de navegación. | Usar una referencia estable (`useRef` a nivel de `AuthProvider` o una variable de módulo) que no dispara re-render y se resetea explícitamente solo en `login()` exitoso. |
| Si `useHandleApiError` depende de `useAuth()`, pero se invoca desde un hook que se ejecuta fuera del árbol de `AuthProvider` (poco probable dado el router actual, pero posible en tests o código futuro), fallaría igual que cualquier otro uso de `useAuth()` hoy. | Mismo riesgo ya aceptado y documentado en SPEC 03 para `useAuth()`/`useNavigate()`; no se introduce nada nuevo, se hereda la mismas restricciones. |
| Quitar el catch silencioso de `POST /logout` podría hacer que un logout con token expirado, en vez de limpiar y quedarse en `/`, ahora mande al usuario a `/session-expired` (una pantalla "de error" para una acción que el usuario inició voluntariamente). | Es el comportamiento pedido explícitamente por el usuario ("si el token vence, vence y punto"); se acepta como válido y se verifica en el criterio de aceptación correspondiente. |

---

## Lo que **no** está en este spec

- Toast global de sesión expirada.
- Componente genérico multi-variante de pantallas de error (404/403/500).
- Refresh automático de token / renovación silenciosa antes de que expire.
- Tipar como clases los demás casos de `handleApiError` (500, error genérico).

Cada uno, si aterriza, va en su propio spec.
