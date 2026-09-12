# Guards Manager

Interfaz web de Guards: catálogo de herramientas, marcas, modelos, personal y resguardos.
React 19 + Vite + TypeScript + Tailwind CSS v4 + HeroUI. Gestor de paquetes: **pnpm**.

## Requisitos

- Node 24 y pnpm 11
- El API (`guards-api`) corriendo en `http://localhost:8000` para el desarrollo diario
- PHP 8.4 y Composer solo si vas a correr las pruebas E2E (levantan el API por su cuenta)

## Arranque

```bash
pnpm install
cp .env.example .env   # si no existe: VITE_API_URL=http://localhost:8000/api/v1
pnpm dev               # http://localhost:5173
```

Variables de entorno:

| Variable       | Uso                                                       |
| -------------- | --------------------------------------------------------- |
| `VITE_API_URL` | Base del API. Por defecto `http://localhost:8000/api/v1`. |

## Verificación

```bash
pnpm exec tsc --noEmit -p tsconfig.app.json
pnpm exec eslint .
pnpm exec prettier --check .
pnpm build
```

## Pruebas E2E (Playwright)

Instalación del navegador (una sola vez por máquina, descarga ~150 MB en
`%LOCALAPPDATA%\ms-playwright`):

```bash
pnpm exec playwright install chromium
```

Ejecución:

```bash
pnpm e2e                        # toda la suite
pnpm e2e --grep @fase-0         # solo una fase
pnpm e2e --grep-invert @fase-0  # regresión: todo menos esa fase
```

`pnpm e2e` levanta por su cuenta el API (`php artisan serve` en el puerto 8100, base de datos
`guards-api/database/e2e.sqlite`) y un Vite propio en el puerto 5174, así que **no** toca ni tu
servidor de desarrollo ni `database/database.sqlite`. Si el API no vive en `../guards-api`,
indícalo con `GUARDS_API_DIR`:

```bash
GUARDS_API_DIR=/ruta/a/guards-api pnpm e2e
```

Detalle de la infraestructura, helpers y convenciones de las pruebas: [`e2e/README.md`](e2e/README.md).

## Estructura

Arquitectura modular inspirada en DDD (`domain`, `application`, `hooks`, `infraestructure`).
Convenciones obligatorias en [`CLAUDE.md`](CLAUDE.md) y
`.claude/skills/react-ts-standards/SKILL.md`.

## Despliegue en producción (Docker)

`docker/prod/Dockerfile` es multi-stage: compila el bundle con `pnpm build` y lo sirve
con `nginx` (fallback de rutas para el SPA de react-router en `docker/prod/nginx.conf`).

`VITE_API_URL` se hornea en el bundle en **tiempo de build** (Vite solo lee `import.meta.env`
al compilar, no en runtime), así que se pasa como `ARG` de build, no como variable de entorno
del contenedor ni con un `env.js` generado al arrancar:

```bash
docker build \
  --build-arg VITE_API_URL=https://api.tu-dominio.com/api/v1 \
  -f docker/prod/Dockerfile \
  -t guards-manager:prod .
```

```bash
docker run --rm -p 8080:80 guards-manager:prod   # http://localhost:8080
```

El `--build-arg` es obligatorio: el `Dockerfile` aborta antes de compilar si `VITE_API_URL`
llega vacío, porque el bundle resultante mandaría todas las peticiones al propio `nginx` del
front. Si el dominio del API cambia, hay que reconstruir la imagen con el nuevo valor (no
basta con reiniciar el contenedor).

`docker-compose.prod.yml` de `guards-api` orquesta solo el backend (`app`, `nginx`, `queue`,
`scheduler`, `mysql`) y no declara ningún servicio de este front: la imagen del front se
construye y se corre aparte con los dos comandos de arriba, apuntando `VITE_API_URL` al host
y puerto que publica el `nginx` del API (con el `APP_PORT` por defecto,
`http://localhost:8080/api/v1`).
