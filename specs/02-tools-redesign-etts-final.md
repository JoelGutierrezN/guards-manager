# SPEC 02 — Redesign pantalla Herramientas (alineación al diseño ETTS final)

> **Estado:** Approved · **Depende de:** SPEC 01 · **Fecha:** 2026-06-13  
> **Objetivo:** Ajustar la pantalla `/dashboard/tools` para que coincida exactamente
> con el diseño ETTS final: eliminar StatStrip, corregir pestañas, eliminar selección
> masiva, rediseñar el panel de filtros (slider + árbol catálogo) y adaptar la tabla
> (columnas MARCA / MODELO / STOCK DISP.·TOTAL / ASIGN. con barra de color).

---

## 2 — Alcance

**Dentro:**

- Eliminar `StatStrip` y `STAT_STRIP_ITEMS` de `tools.page.tsx`.
- Pestañas: reemplazar las 5 actuales por 4 exactas del diseño:
  `Todas | Disponibles | Asignadas | Stock bajo / agotadas`.
- Eliminar selección masiva de filas: checkboxes, `selectedIds`, `ToolBulkActions`,
  acciones `TOGGLE_SELECT` / `TOGGLE_SELECT_ALL` del reducer.
- Eliminar toggle de densidad (`density` del estado y su UI).
- Botón "Ingresar inventario" abre `ToolIngresoModal` sin herramienta pre-seleccionada
  (en lugar de navegar a `/stockIn`); el modal ya existe, sólo cambia el trigger.
- Panel de filtros rediseñado:
  - Eliminar checkboxes de Estado.
  - Añadir slider "RANGO DE STOCK" (0 – 50+).
  - Convertir filtro de Marca en árbol jerárquico Marca → Modelos (colapsable, con conteos).
- Tabla rediseñada:
  - Columnas: HERRAMIENTA · MARCA · MODELO · STOCK DISP. / TOTAL (ordenable) · ASIGN. · acciones (editar / eliminar).
  - Celda STOCK DISP. / TOTAL muestra fracción `disponible / total` + barra de color
    (azul oscuro = ok, amarillo = warn, rojo = low/agotado).
  - Columna ASIGN. muestra conteo de herramientas asignadas.
- Añadir campo `available` a `Tool` entity y mocks.
- Toolbar de tabla: añadir input de búsqueda ("Buscar por nombre, modelo o SKU...").
- Texto del `PageHero`: título `Catálogo de herramientas` (itálica en `de herramientas`),
  lede actualizado al del diseño.
- Actualizar `ToolsTabKey`, `ToolFilters`, `ToolsState`, reducer y `ToolFilterService`
  para reflejar todos los cambios anteriores.

**Fuera de alcance:**

- Cambios en el sidebar (nuevos ítems: Ingreso de inventario, Nueva asignación,
  Resguardo, Personal, Mi perfil, Estados).
- Funcionalidad real de editar / eliminar fila (íconos presentes, acción pendiente `// TODO`).
- Búsqueda y ordenación server-side.
- Conexión a la API (todos los puntos siguen con `// TODO API:`).
- Arreglo de errores preexistentes en `modules/auth`.

---

## 3 — Modelo de datos

### Cambios a entidades existentes

```ts
// src/modules/tools/domain/tool.entity.ts
export type ToolStatus = 'ok' | 'warn' | 'low'
export interface Tool {
  id: number
  name: string
  brand: string
  model: string
  total: number
  available: number   // NUEVO — unidades disponibles (total - assigned)
  assigned: number
  status: ToolStatus
}

// src/modules/tools/domain/tools-tab.model.ts
export type ToolsTabKey = 'all' | 'available' | 'assigned' | 'low'
// Se eliminan 'mantto' y 'baja'; se añade 'assigned'

// src/modules/tools/domain/tool-filters.model.ts
export interface ToolFilters {
  brands: string[]
  models: string[]             // NUEVO — filtro por modelo dentro de una marca
  stockRange: [number, number] // NUEVO — slider 0..50+
}

// src/modules/tools/application/tools-state.model.ts
// Se eliminan: selectedIds, density
// Se añade: searchQuery (para el input de la toolbar)
export interface ToolsState {
  rows: Tool[]
  filters: ToolFilters
  searchQuery: string
  tab: ToolsTabKey
  page: number
  showFilters: boolean
  newToolOpen: boolean
  ingresoTool: Tool | null
  progress: ProgressEntry | null
}

// Acciones eliminadas del reducer:
// TOGGLE_SELECT, TOGGLE_SELECT_ALL, SET_DENSITY
// Acciones añadidas:
// TOGGLE_MODEL (string), SET_STOCK_RANGE ([number, number]), SET_SEARCH (string)
```

### Mocks a actualizar

- `tools.mock.ts` — añadir campo `available` a cada `Tool`.
- `tools-stats.mock.ts` — actualizar `tabCounts` a las 4 claves nuevas
  (`all`, `available`, `assigned`, `low`); eliminar `mantto` y `baja`.
- `catalog.mock.ts` — estructura jerárquica:
  `Array<{ brand: string; count: number; models: Array<{ name: string; count: number }> }>`.

---

## 4 — Plan de implementación

1. **Domain:** Añadir `available` a `tool.entity.ts`; reemplazar `ToolsTabKey`;
   reescribir `ToolFilters` con `models` y `stockRange`.

2. **State & reducer:** Actualizar `ToolsState` (quitar `selectedIds`, `density`;
   añadir `searchQuery`). Añadir acciones `TOGGLE_MODEL`, `SET_STOCK_RANGE`,
   `SET_SEARCH`; eliminar `TOGGLE_SELECT`, `TOGGLE_SELECT_ALL`, `SET_DENSITY`.

3. **ToolFilterService:** Añadir filtrado por `models`, `stockRange` y `searchQuery`;
   añadir lógica de tab `assigned`; eliminar filtrado por `statuses`.

4. **use-tools-inventory.hook.ts:** Exponer nuevos dispatchers (`toggleModel`,
   `setStockRange`, `setSearch`); eliminar `toggleStatus`, `toggleSelect`,
   `toggleSelectAll`, `setDensity`, `allSelected`, `someSelected`.

5. **Mocks:** Actualizar `tools.mock.ts` (`available`), `tools-stats.mock.ts`
   (4 tab keys), `catalog.mock.ts` (estructura jerárquica marca → modelos).

6. **tool-filters.component.tsx:** Eliminar checkboxes de Estado; añadir slider
   "RANGO DE STOCK"; reemplazar lista plana de marcas por árbol colapsable
   Marca (checkbox + conteo) → Modelos (checkbox + conteo indentado).

7. **tool-table-toolbar.component.tsx:** Añadir input de búsqueda con placeholder
   "Buscar por nombre, modelo o SKU..."; eliminar toggle de densidad.

8. **tool-row.component.tsx:** Eliminar checkbox; añadir celdas MARCA y MODELO;
   reemplazar indicador de stock por fracción `available / total` + barra de color
   (`ok` → azul oscuro, `warn` → amarillo/naranja, `low` → rojo); añadir celda ASIGN.;
   añadir íconos editar / eliminar con `// TODO` en sus handlers.

9. **tool-table.component.tsx:** Eliminar columna checkbox, prop `selectedIds`,
   `allSelected`, `someSelected`, `density`; añadir columnas MARCA, MODELO, ASIGN.;
   añadir indicador de orden en cabecera STOCK DISP. / TOTAL.

10. **tool-bulk-actions.component.tsx:** Eliminar archivo completo.

11. **tools.page.tsx:** Quitar `StatStrip` + `STAT_STRIP_ITEMS`; actualizar
    `TAB_ITEMS` a 4 pestañas; cambiar "Ingresar inventario" para llamar a
    `openIngreso(null)` en lugar de `navigate('/stockIn')`; actualizar texto
    `PageHero` (título, itálica, lede).

12. **tool-ingreso-modal.component.tsx:** Aceptar `tool: Tool | null`; si es `null`,
    mostrar un selector de herramienta antes de la cantidad (`// TODO` por ahora,
    campo opcional vacío es suficiente para este spec).

13. **Verificación:** `npx tsc -b` sin errores nuevos; `npx eslint` limpio;
    `npx vite build` compila.

---

## 5 — Criterios de aceptación

- [ ] La pantalla `/dashboard/tools` no muestra la franja de KPIs (StatStrip).
- [ ] Las pestañas son exactamente 4: Todas · Disponibles · Asignadas · Stock bajo / agotadas.
- [ ] No existen checkboxes en las filas ni panel de acciones masivas.
- [ ] El botón "Ingresar inventario" abre `ToolIngresoModal`, no navega a `/stockIn`.
- [ ] El panel de filtros muestra slider "RANGO DE STOCK" y árbol jerárquico
  Marca → Modelos (colapsable, con conteos); no hay checkboxes de Estado.
- [ ] La tabla tiene columnas: HERRAMIENTA · MARCA · MODELO · STOCK DISP. / TOTAL · ASIGN. · acciones.
- [ ] La celda STOCK DISP. / TOTAL muestra `available / total` + barra de color
  (azul oscuro = ok, amarillo = warn, rojo = low/agotado).
- [ ] La toolbar de la tabla incluye un input con placeholder
  "Buscar por nombre, modelo o SKU..." que filtra las filas visibles.
- [ ] El `PageHero` muestra título "Catálogo de herramientas" con itálica en
  "de herramientas" y el lede del diseño.
- [ ] `tsc -b` y `eslint` sin errores nuevos; `vite build` compila.

---

## 6 — Decisiones tomadas y descartadas

- **Sí:** Eliminar `StatStrip` completamente — no aparece en el diseño final.
- **Sí:** 4 pestañas exactas del diseño; se descarta conservar "Mantenimiento" y "Bajas"
  aunque existían en el estado anterior.
- **Sí:** Eliminar selección masiva — simplifica el estado y el reducer sin perder
  funcionalidad que el diseño no contempla.
- **Sí:** `openIngreso(null)` desde el botón del header — reutiliza el modal existente;
  el selector de herramienta dentro del modal se deja como `// TODO` para no bloquear
  este spec con un flujo no definido aún.
- **Sí:** `searchQuery` en el estado global (`ToolsState`) en lugar de estado local del
  toolbar — mantiene coherencia con el patrón `useReducer` existente.
- **Sí:** Árbol marca → modelos en el panel de filtros como estructura jerárquica en
  `catalog.mock.ts`; un componente separado para el ítem de modelo indentado.
- **No:** Ordenación server-side en STOCK DISP. / TOTAL — sólo indicador visual de
  columna ordenable; la lógica real queda marcada con `// TODO API:`.
- **No:** Funcionalidad de editar / eliminar fila — íconos presentes con handlers
  vacíos `// TODO`; se especifica en spec futuro cuando exista el flujo de detalle.
- **No:** Cambios en el sidebar — fuera del alcance de este spec.
