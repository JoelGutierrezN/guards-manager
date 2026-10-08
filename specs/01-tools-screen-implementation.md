# SPEC 01 — Pantalla de Herramientas (catálogo e inventario)

> **Estado:** Implementado · **Depende de:** — · **Fecha:** 2026-06-09
> **Objetivo:** Implementar y habilitar la pantalla «Herramientas» en `/dashboard/tools`, fiel al diseño ETTS, con datos mock aislados y lista para conectar a la API.

---

## 1 — Por qué existe este spec

El diseño exportado de Claude Design (proyecto ETTS «ensamblajes Duart») requería construir la pantalla de Herramientas.

El shell ya existía (sidebar, topbar, panel) pero `dashboard.page.tsx` siempre renderizaba el panel, sin importar el ítem seleccionado.

Se aprovechó para fijar tres bases del proyecto: estándares de código obligatorios, navegación con enrutado real (react-router) y aislamiento de datos falsos en mocks.

---

## 2 — Alcance

**Dentro:**

- Pantalla «Herramientas» fiel al diseño: hero compacto, franja de 5 KPIs, pestañas, sidebar de filtros, tabla seleccionable, acciones de fila, 3 modales (Nueva herramienta con combobox, Declarar ingreso, overlay de progreso) y toasts.
- Refactor de navegación a react-router: `DashboardLayout` con `<Outlet/>` y rutas anidadas **lazy** (`/dashboard`, `/dashboard/tools`, comodín `*`).
- Sidebar y Topbar derivan el ítem activo de `useLocation()` y navegan con el router.
- Primitivos de UI compartidos en Tailwind v4 (`Icon`, `IconButton`, `Input`, `Checkbox`, `Tabs`, `Pager`, `Empty`, `PageHero`, `StatStrip`, `Modal`, `SelectTrigger`, `useToasts`); `Button` con variante `danger` y `Segmented` con icono.
- Skill de proyecto `react-ts-standards` + `CLAUDE.md` con las 10 reglas de código.
- Toda la fake data aislada en `infraestructure/mocks/` y marcadores `// TODO API:` en cada punto de integración.
- Token de tema `--color-paper-tint` (y `--color-bg-app`).
- Responsive y animaciones nativas (`reveal` escalonado, `spin`, transición de modal) con `prefers-reduced-motion`.

**Fuera de alcance (para specs futuros):**

- Conexión real a la API: implementar los endpoints marcados con `// TODO API:`.
- Pantallas `stockIn`, `brands`, `models`, `employees`, `assignments` (hoy resuelven a `ComingSoonPage`).
- Acciones server-side reales: exportar, búsqueda, orden, paginación y acciones masivas (asignar / mantto / eliminar).
- Arreglar los 9 errores preexistentes de `modules/auth` y `errors/app.error.handler.ts` que rompen `pnpm build` (`tsc -b`).

---

## 3 — Modelo de datos

Estructuras nuevas (nombres y rutas reales):

```ts
// src/modules/tools/domain/tool.entity.ts
export type ToolStatus = 'ok' | 'warn' | 'low'
export interface Tool {
  id: number
  name: string
  brand: string
  model: string
  total: number
  assigned: number
  status: ToolStatus
}

// src/modules/tools/domain/tool-filters.model.ts
export interface ToolFilters {
  brands: string[]
  statuses: string[]
}

// src/modules/tools/domain/tools-tab.model.ts
export type ToolsTabKey = 'all' | 'available' | 'low' | 'mantto' | 'baja'

// src/modules/tools/domain/tools-stats.model.ts  (KPIs y conteos agregados)
export interface ToolsStats {
  kpis: ToolsKpis
  tabCounts: Record<ToolsTabKey, number>
  statusCounts: Record<string, number>
  brandCounts: Record<string, number>
  totalCount: number
  pageCount: number
  stockRange: { min: number; max: number }
}

// src/modules/tools/application/tools-state.model.ts  (estado del useReducer)
export interface ToolsState {
  rows: Tool[]
  filters: ToolFilters
  selectedIds: Set<number>
  tab: ToolsTabKey
  page: number
  showFilters: boolean
  density: 'dense' | 'comfy'
  newToolOpen: boolean
  ingresoTool: Tool | null
  progress: { tool: Tool; total: number } | null
}
```

Convenciones:

- Sufijos por responsabilidad: `*.component.tsx`, `*.hook.ts`, `*.service.ts`, `*.helper.ts`, `*.model.ts`, `*.entity.ts`.
- La fake data vive sólo en `src/modules/tools/infraestructure/mocks/` (`tools.mock.ts`, `catalog.mock.ts`, `tools-stats.mock.ts`).
- Las opciones de filtro estáticas (estados y pestañas: clave + etiqueta) NO son mock; los conteos sí.

---

## 4 — Plan de implementación

1. Estándares: crear `.claude/skills/react-ts-standards/SKILL.md` (10 reglas con ejemplos) y `CLAUDE.md` en la raíz.
2. Tema: añadir `--color-paper-tint` y `--color-bg-app` al bloque `@theme` de `src/index.css`.
3. Primitivos UI en `src/modules/shared/infraestructure/components/ui/` (un componente por archivo, tipos en `*.model.ts`); extender `Button` (`danger`) y `Segmented` (`icon`); actualizar `ui/index.ts`.
4. Enrutado: crear `layouts/dashboard.layout.tsx` (`Sidebar` + `Topbar` + `<Outlet/>`), reescribir `router/app.router.tsx` con rutas anidadas lazy, crear `pages/dashboard-panel.page.tsx` y `pages/coming-soon.page.tsx`, eliminar `pages/dashboard.page.tsx`.
5. Navegación: refactorizar Sidebar y Topbar para usar `useLocation`/`useNavigate` y `DashboardRouteHelper` (`pathForId`, `activeIdFromPath`); separar subcomponentes (`sidebar-nav-section`, `topbar-breadcrumb-segment`) por la regla de un componente por archivo.
6. Módulo `src/modules/tools/`: `domain/`, `application/` (reducer + `ToolFilterService`, `InventoryService`, `ToolStatusHelper`), `hooks/use-tools-inventory.hook.ts` (`useReducer` + derivados memo), `infraestructure/pages/tools.page.tsx`, `infraestructure/components/*` (filtros, tabla, fila, toolbar, acciones masivas, modales, combobox) y `tools.css`.
7. Corregir lint `react-hooks/set-state-in-effect`: los modales resetean al cerrar y el overlay de progreso se monta de forma condicional.
8. Aislar fake data: crear `infraestructure/mocks/*`, borrar `infraestructure/data/*`, reconectar consumidores y colocar `// TODO API:` en cada endpoint.
9. Verificación: `npx tsc -b`, `npx eslint`, `npx vite build` (con code-splitting de las rutas lazy).

---

## 5 — Criterios de aceptación

- [x] Click en «Herramientas» (grupo Catálogos) navega a `/dashboard/tools`; el layout (sidebar + topbar) persiste y sólo cambia el `Outlet`.
- [x] La ruta `/dashboard/tools` se carga como chunk lazy independiente.
- [x] El ítem activo del sidebar y el breadcrumb se derivan de la URL.
- [x] Pestañas, checkboxes de Estado/Marca, selección de filas (incl. indeterminado), toggle de filtros, densidad y paginador responden.
- [x] «Declarar ingreso» → modal de cantidad → overlay de progreso animado → toast y suma al stock.
- [x] «Nueva herramienta» → modal con combobox marca→modelo (incluye crear) → toast.
- [x] Diseño responsive (hero/KPIs/grid colapsan) y animaciones `reveal` respetando `prefers-reduced-motion`.
- [x] La fake data existe sólo en `infraestructure/mocks/`; cada endpoint pendiente está marcado con `// TODO API:`.
- [x] `eslint` y `tsc -b` sin errores en el código nuevo; `vite build` compila con los chunks lazy.

---

## 6 — Decisiones tomadas y descartadas

- **Sí:** react-router con `DashboardLayout` + `<Outlet/>` y rutas lazy. Se elimina el estado local `active`; el layout es fijo y sólo cambia el contenido.
- **Sí:** `useReducer` dentro de `useToolsInventory` para el estado de la pantalla. Hay muchos estados relacionados (regla del proyecto).
- **Sí:** helpers/servicios como clases con SRP (`ToolFilterService`, `InventoryService`, `ToolStatusHelper`, `DashboardRouteHelper`, `PagerPagesHelper`).
- **Sí:** fake data en `mocks/` (borrable de un golpe) y `// TODO API:` en los seams. Hace trivial la integración futura.
- **Sí:** Tailwind v4 vía `@theme` en `index.css`; sólo faltaba `paper-tint`.
- **No:** capa repository asíncrona ahora. Se difiere a la integración real de la API para no introducir async prematuro.
- **No:** arreglar los errores preexistentes de `auth`/error-handler. Fuera de alcance; se documentan como riesgo.
- **No:** worktrees aislados para todos los agentes de construcción. Los worktrees no traen `node_modules`, así que el módulo grande se construyó en el árbol principal para poder type-checkear.
- **No:** persistir la creación de marcas/modelos/herramientas. Hoy sólo emiten toast; la persistencia queda marcada con `// TODO API:`.

---

## 7 — Riesgos identificados

| Riesgo                                                                                                                                                         | Mitigación                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `pnpm build` falla por 9 errores preexistentes en `modules/auth` y `errors/app.error.handler.ts` (`erasableSyntaxOnly`, `captureStackTrace`, export faltante). | No son de este spec; `vite dev`/`vite build` funcionan. Documentado como tarea fuera de alcance.   |
| El mock está acoplado a componentes (KPIs, conteos, catálogo).                                                                                                 | Aislado en `infraestructure/mocks/` y cada consumidor lleva `// TODO API:` señalando el reemplazo. |
| Ítems del sidebar sin pantalla (brands, models, …) podrían dar 404.                                                                                            | Ruta comodín `*` → `ComingSoonPage` dentro del layout.                                             |

---

## Lo que **no** está en este spec

- La conexión real a la API (implementar los endpoints `// TODO API:`).
- Las pantallas `stockIn`, `brands`, `models`, `employees`, `assignments`.
- Exportar, búsqueda/orden server-side y acciones masivas reales.
- El arreglo de los errores preexistentes de `auth` que rompen `pnpm build`.

Cada uno, si aterriza, va en su propio spec.
