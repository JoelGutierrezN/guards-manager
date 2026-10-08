# Pruebas E2E (Playwright)

Las pruebas de front de este proyecto son **solo** Playwright (no hay Vitest). Cada pantalla nueva
aporta al menos un camino feliz etiquetado con la fase que la introdujo.

## Cómo se levanta el entorno

`playwright.config.ts` arranca dos servidores dedicados (`reuseExistingServer: false`, `workers: 1`,
puertos fijos) para no chocar con el desarrollo diario:

| Servidor | Comando                                                      | Puerto | Notas                                                                 |
| -------- | ------------------------------------------------------------ | ------ | --------------------------------------------------------------------- |
| API      | `php artisan serve --host=127.0.0.1 --port=8100 --no-reload` | 8100   | `cwd` = `GUARDS_API_DIR` o `../guards-api`. Sondeo de salud en `/up`. |
| Front    | `pnpm dev --port 5174 --strictPort`                          | 5174   | `VITE_API_URL=http://127.0.0.1:8100/api/v1`                           |

`--no-reload` es obligatorio: sin él, `artisan serve` reinicia el proceso hijo y este pierde las
variables de entorno que le inyecta Playwright.

El API corre contra su propia base `guards-api/database/e2e.sqlite` con `SEED_DEMO_DATA=true` y
`QUEUE_CONNECTION=sync`. `e2e/global-setup.ts` la crea si falta y ejecuta
`php artisan migrate:fresh --seed --force` antes de la primera prueba, así que **cada corrida parte
de datos demo limpios** y `database/database.sqlite` nunca se toca.

## Proyectos y sesión

1. `setup` (`e2e/auth.setup.ts`) hace login por API con `testuser` / `password` y guarda el
   `storageState` en `e2e/.auth/user.json` (ignorado por git).
2. `chromium` corre `e2e/specs/**/*.spec.ts` con esa sesión ya cargada.

Una prueba que necesite empezar sin sesión (como el smoke) la descarta con:

```ts
test.use({ storageState: { cookies: [], origins: [] } })
```

## Etiquetas por fase

Cada prueba lleva `@fase-N` en su título. Se usan así:

```bash
pnpm e2e --grep @fase-0         # solo esa fase
pnpm e2e --grep-invert @fase-0  # regresión de todo lo anterior
```

## Helpers

| Archivo                      | Responsabilidad                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `support/config.ts`          | Puertos, URLs, rutas y variables de entorno de la corrida.                           |
| `support/api.ts`             | `ApiClient`: login y alta de marcas, modelos, productos y empleados por API.         |
| `support/auth.ts`            | `AuthStorageState`: escribe el `storageState` que consume el proyecto `chromium`.    |
| `support/unique-name.ts`     | Nombres únicos por corrida (`Marca E2E-<runId>-<n>`) para no colisionar con el seed. |
| `support/console-watcher.ts` | Acumula `console.error` y excepciones de página para afirmarlas al final.            |
| `support/sidebar-routes.ts`  | Espejo del menú lateral; si cambia el sidebar, el smoke falla.                       |

Crea datos por API (`ApiClient`), nunca por SQL ni con `page.route`: el objetivo es verificar el
contrato real entre front y API.

## Artefactos

`playwright-report/`, `test-results/`, `blob-report/` y `e2e/.auth/` están ignorados por git,
Prettier y ESLint.
