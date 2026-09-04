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
