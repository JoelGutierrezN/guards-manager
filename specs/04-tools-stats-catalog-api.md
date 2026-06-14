# SPEC 04 — Conectar filtros de Herramientas a la API (stats + catálogo)

> **Estado:** Borrador · **Depende de:** SPEC 02 · **Fecha:** 2026-06-13
> **Objetivo:** Poblar desde la API los conteos de las 4 pestañas (GET /products/stats) y el árbol de catálogo marca→modelos con el tope del slider (GET /brands/catalog/tree) en `/dashboard/tools`, dejando los controles inertes (togglean visual, no filtran) y las filas de la tabla en mock.

---

## 1 — Por qué existe este spec

Es la **primera integración real con la API** del proyecto. Hoy `HttpDataSource` existe pero no se instancia en ningún lado, no hay raíz de composición, no hay `.env`, y `useAuthService` es un stub.

Este spec deja montada la base mínima de red (base URL por entorno + interceptor de token) y la usa para alimentar dos zonas de la pantalla Herramientas que hoy leen mock: los conteos de pestañas y el panel de filtros izquierdo.

Las acciones (filtrado server-side al hacer clic, traer la lista de la tabla) se difieren a un spec posterior; por eso los controles quedan **inertes**.

> El login real (escribir `access_token` automáticamente) se especifica aparte en
> SPEC 03 (auth). Este spec no lo depende: para probar, el token se coloca a mano en
> localStorage.

---

## 2 — Alcance

**Dentro:**

- **Base de red mínima (compartida):**
  - Crear `.env` con `VITE_API_URL=http://localhost:8000/api/v1` y `api.config.ts` que la lee con fallback.
  - Tipar `import.meta.env.VITE_API_URL` (env.d.ts).
  - `HttpDataSource`: añadir interceptor de request que adjunta `Authorization: Bearer {token}` leyendo `access_token` de localStorage (vía `StorageService`); mejorar `get<T>` para devolver `response.data` tipado.

- **Endpoint /products/stats → conteos de pestañas + lede:**
  - Entidad `InventoryStats { total, assigned, available, criticalStock }`.
  - Conteos de las 4 pestañas desde la API: `all=total`, `available=available`, `assigned=assigned`, `low=criticalStock`.
  - Reemplazar el número fijo "1,284" del lede del `PageHero` por `stats.total` formateado.

- **Endpoint /brands/catalog/tree → panel de filtros izquierdo:**
  - Árbol marca→modelos con sus `id`, `name` y conteos (`totalProducts`).
  - `meta.maxStock` alimenta el tope (`max`) del slider "Rango de stock".

- **Capa DDD en `tools` (patrón del módulo `auth`):**
  - Contrato `InventoryRepository` (domain), DTOs, mappers, repositorio de infraestructura y hook `useInventoryOverview` (carga ambos endpoints en paralelo, expone `status` + `reload`).

- **Estados de UI:** skeletons mientras carga (pestañas y árbol), mensaje breve con botón "Reintentar" en error, estado vacío si el árbol viene vacío.

- **Controles inertes:** pestañas, checkboxes de marca/modelo y slider togglean su estado visual pero NO filtran; la tabla muestra siempre `state.rows` (se desconecta `ToolFilterService`/`filteredRows`).

- **Limpieza de mocks:** eliminar `tabCounts` de `tools-stats.mock.ts` y `MOCK_CATALOG_TREE` de `catalog.mock.ts` (con su `// TODO API:`).

**Fuera de alcance (para specs futuros):**

- Filtrado y conteos reactivos al clic (server-side): hacer que pestañas/marcas/slider filtren la lista. Va en el spec de acciones.
- Traer la lista de la tabla desde la API (`rows`, `totalCount`, `pageCount` siguen mock).
- Conectar el login: hoy no escribe `access_token`; el token se coloca a mano en localStorage para probar. (SPEC 03 — auth.)
- Persistir o crear marcas/modelos/herramientas (combobox de "Nueva herramienta" sigue con `MOCK_BRANDS`/`MOCK_MODELS`).
- Arreglar el `post<T>` roto de `HttpDataSource` y los errores preexistentes de `auth`.
- Exportar, búsqueda y ordenación server-side.

---

## 3 — Modelo de datos

### Entidades / modelos de dominio (nuevos)

```ts
// src/modules/tools/domain/inventory-stats.entity.ts
export interface InventoryStats {
  total: number
  assigned: number
  available: number
  criticalStock: number
}

// src/modules/tools/domain/inventory-repository.ts  (contrato)
export interface InventoryRepository {
  getStats(): Promise<InventoryStats>
  getCatalogTree(): Promise<CatalogTree>
}

// src/modules/tools/domain/catalog-option.model.ts  (se AÑADE id; se mantiene brand/name)
export interface CatalogModelNode {
  id: string        // NUEVO — uuid del modelo (para el spec de acciones)
  name: string
  count: number     // mapea de productModels[].totalProducts
}
export interface CatalogBrandNode {
  id: string        // NUEVO — uuid de la marca
  brand: string     // mapea de data[].name
  count: number     // mapea de data[].totalProducts
  models: CatalogModelNode[]
}
export interface CatalogTree {
  maxStock: number  // meta.maxStock — tope del slider
  brands: CatalogBrandNode[]
}
```

### DTOs (forma cruda de la API)

```ts
// src/modules/tools/infraestructure/dto/inventory-stats.dto.ts
export interface InventoryStatsDto {
  data: { total: number; assigned: number; available: number; criticalStock: number }
}

// src/modules/tools/infraestructure/dto/catalog-tree.dto.ts
export interface CatalogBrandDto {
  id: string
  name: string
  totalProducts: number
  productModels: Array<{ id: string; name: string; totalProducts: number }>
}
export interface CatalogTreeDto {
  meta: { maxStock: number }
  data: CatalogBrandDto[]
}
```

### Mapeo de pestañas (en `tools.page.tsx`)

| Pestaña                 | Clave       | Campo de /products/stats |
|-------------------------|-------------|--------------------------|
| Todas                   | `all`       | `total`                  |
| Disponibles             | `available` | `available`              |
| Asignadas               | `assigned`  | `assigned`               |
| Stock bajo / agotadas   | `low`       | `criticalStock`          |

### Estado del hook de carga

```ts
// src/modules/tools/hooks/use-inventory-overview.hook.ts
type OverviewStatus = 'loading' | 'ready' | 'error'
// expone: { stats: InventoryStats | null, catalog: CatalogTree | null,
//           status: OverviewStatus, reload: () => void }
```

### Rutas relativas (base `VITE_API_URL` = `http://localhost:8000/api/v1`)

- `GET /products/stats`
- `GET /brands/catalog/tree`

> El encabezado de la doc dice `GET /v1/products/stats`, pero el cURL es la fuente
> autoritativa: la ruta completa es `.../api/v1/products/stats`, así que la ruta
> relativa a la base es `/products/stats` (sin `/v1` extra). Igual para el catálogo.

### Mocks a tocar

- `tools-stats.mock.ts` — eliminar `tabCounts` (lo provee la API). `totalCount` y `pageCount` se quedan (la tabla sigue mock).
- `catalog.mock.ts` — eliminar `MOCK_CATALOG_TREE` y su `// TODO API:`. `MOCK_BRANDS`/`MOCK_MODELS` se quedan.

---

## 4 — Plan de implementación

1. **Config de red.** Crear `.env` con `VITE_API_URL=http://localhost:8000/api/v1`;
   crear `src/modules/shared/infraestructure/config/api.config.ts`
   (`export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'`);
   tipar la variable en `src/vite-env.d.ts` (`interface ImportMetaEnv`).

2. **HttpDataSource: token + get tipado.** Añadir interceptor de request que adjunta
   `Authorization: Bearer {token}` leyendo `access_token` vía `StorageService`;
   cambiar `get<T>(url): Promise<T>` para devolver `response.data`.
   Verificación: `tsc -b` sin errores; `auth` sigue compilando.

3. **Domain de tools.** Crear `inventory-stats.entity.ts` (`InventoryStats`),
   `inventory-repository.ts` (contrato), `catalog-tree` (interfaz `CatalogTree`);
   añadir `id` a `CatalogBrandNode`/`CatalogModelNode` en `catalog-option.model.ts`.

4. **DTOs.** Crear `infraestructure/dto/inventory-stats.dto.ts` y
   `infraestructure/dto/catalog-tree.dto.ts` con la forma cruda de la API.

5. **Mappers.** Crear `infraestructure/mappers/inventory.mapper.ts`:
   `toInventoryStats(dto)` y `toCatalogTree(dto)` (DTO → dominio; `name→brand`,
   `totalProducts→count`, `meta.maxStock→maxStock`).

6. **Repositorio.** Crear `infraestructure/repositories/inventory.repository.ts`
   implementando el contrato con `HttpDataSource` (GET `/products/stats`,
   GET `/brands/catalog/tree`) + `handleApiError`. Exportar singleton
   `inventoryRepository` (instancia `new HttpDataSource(API_BASE_URL)` a nivel módulo).

7. **Hook de carga.** Crear `hooks/use-inventory-overview.hook.ts`: `useEffect` que
   dispara ambos endpoints en paralelo (`Promise.all`), expone
   `{ stats, catalog, status, reload }`.

8. **Pestañas + lede (`tools.page.tsx`).** Consumir `useInventoryOverview`; construir
   `TAB_ITEMS` dentro del componente con los conteos de `stats`
   (`all=total, available=available, assigned=assigned, low=criticalStock`);
   mientras `status==='loading'` mostrar conteos en skeleton; reemplazar el número
   del lede por `stats.total` formateado. Eliminar import de `tabCounts`.

9. **Inertar la tabla.** En `use-tools-inventory.hook.ts` dejar de calcular
   `filteredRows` con `ToolFilterService`; en `tools.page.tsx` pasar `rows={state.rows}`.
   (El archivo `tool-filter.service.ts` se queda para el spec de acciones.)

10. **Panel de filtros (`tool-filters.component.tsx`).** Recibir por props
    `brands`, `maxStock` y `status` desde la página (en vez de `MOCK_CATALOG_TREE`);
    pasar `maxStock` como `max` del slider; render de skeleton en carga, mensaje +
    botón "Reintentar" en error, estado vacío si `brands` está vacío.

11. **Brand node.** En `tool-filter-brand-node.component.tsx` usar `node.id` como key
    interna donde aplique; selección sigue por `node.brand` / `model.name` (visual).
    Ajustar `key` del `.map()` en el panel a `node.id`.

12. **Limpieza de mocks.** Quitar `tabCounts` de `tools-stats.mock.ts`; quitar
    `MOCK_CATALOG_TREE` y su `// TODO API:` de `catalog.mock.ts`.

13. **Verificación.** `npx tsc -b` sin errores nuevos; `npx eslint` limpio;
    `npx vite build` compila. Prueba manual con token en localStorage
    (`StorageService.set('access_token', '<token>')`): pestañas con conteos reales,
    árbol real, slider con tope `maxStock`, lede con `total`; apagar la API → skeleton
    y luego error con "Reintentar".

---

## 5 — Criterios de aceptación

- [ ] Existe `.env` con `VITE_API_URL` y `api.config.ts` la lee con fallback a `http://localhost:8000/api/v1`.
- [ ] Toda petición de `HttpDataSource` envía el header `Authorization: Bearer {token}` cuando hay `access_token` en localStorage.
- [ ] Con la API arriba y un token válido, las 4 pestañas muestran los conteos reales: Todas=`total`, Disponibles=`available`, Asignadas=`assigned`, Stock bajo / agotadas=`criticalStock`.
- [ ] El número del lede del `PageHero` muestra `stats.total` formateado (ya no el fijo "1,284").
- [ ] El panel de filtros izquierdo renderiza el árbol marca→modelos con los conteos provenientes de `/brands/catalog/tree`.
- [ ] El tope (`max`) del slider "Rango de stock" es `meta.maxStock` de la API.
- [ ] Mientras cargan, pestañas y árbol muestran skeleton; al terminar, muestran datos.
- [ ] Si la API falla, el panel de filtros muestra un mensaje breve con botón "Reintentar" que vuelve a disparar la carga.
- [ ] Si el árbol viene vacío, el panel muestra un estado vacío (no un árbol en blanco roto).
- [ ] Cambiar de pestaña, marcar/desmarcar marcas/modelos y mover el slider togglean su estado visual pero NO alteran las filas de la tabla (la tabla muestra todas las filas mock).
- [ ] `tools-stats.mock.ts` ya no exporta `tabCounts` y `catalog.mock.ts` ya no exporta `MOCK_CATALOG_TREE`.
- [ ] `npx tsc -b` y `npx eslint` sin errores nuevos; `npx vite build` compila.

---

## 6 — Decisiones tomadas y descartadas

- **Sí:** Controles inertes (togglean visual, no filtran). El filtrado real será
  server-side; mantener filtrado local sobre el mock mientras los conteos vienen de
  la API daría un estado incoherente (los conteos no cuadrarían con las filas mock).
- **No:** Conservar el filtrado local de `ToolFilterService`. Se desconecta de las
  filas; el archivo se queda intacto para reconectarlo en el spec de acciones.
- **Sí:** `VITE_API_URL` por entorno con fallback. Configurable sin tocar código;
  primer uso de `import.meta.env` en el proyecto.
- **Sí:** Interceptor de token en `HttpDataSource` leyendo `access_token` de
  localStorage. Centraliza el auth header para toda futura llamada.
- **No:** Fallback `VITE_API_TOKEN` para dev. Para probar se coloca el token a mano
  en localStorage; se evita una variable de entorno que se colaría a producción.
- **Sí:** Un solo hook `useInventoryOverview` que carga ambos endpoints en paralelo
  con `status`/`reload` combinados. Una sola zona de carga/error, un solo reintento.
- **No:** Use cases separados por endpoint (estilo `auth.usecase.ts`). Para lecturas
  simples añade capas sin valor; el repositorio + hook bastan.
- **Sí:** Añadir `id` al árbol de catálogo aunque la selección siga por `name`.
  Deja listos los identificadores para el filtrado server-side del próximo spec sin
  reabrir el mapeo.
- **Sí:** Reemplazar el número del lede por `stats.total`. Es dato del mismo endpoint
  y "desplegar información" es justo el objetivo del spec.
- **No:** Traer la lista de la tabla (`rows`, `totalCount`, `pageCount`). Sigue mock;
  su endpoint y la paginación real van en otro spec.
- **Sí:** Eliminar los mocks reemplazados (`tabCounts`, `MOCK_CATALOG_TREE`).
  Coherente con CLAUDE.md (los mocks se borran al integrar); evita data muerta.
- **No:** Arreglar el `post<T>` roto de `HttpDataSource` ni el login. Este spec solo
  necesita `GET`; el resto se documenta como riesgo / spec aparte.

---

## 7 — Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Sin login conectado no hay `access_token`: toda llamada daría `401`. | Para probar se coloca el token a mano (`StorageService.set('access_token', '<token>')`); el interceptor ya lo adjunta. Conectar el login va en SPEC 03 (auth). |
| `StorageService` guarda con `JSON.stringify`: un token pegado "en crudo" en localStorage no se parsea bien. | Documentar que se setee con `StorageService.set(...)` desde consola, no escribiendo la clave a mano sin comillas. |
| CORS / API local apagada en dev. | Estados de carga/error con "Reintentar"; la pantalla no se rompe, solo no muestra datos. |
| Discrepancia de ruta en la doc (`/v1/products/stats` vs cURL). | Se fija la ruta relativa correcta (`/products/stats`) tomando el cURL como autoritativo; anotado en el modelo de datos. |

---

## Lo que **no** está en este spec

- Filtrado/conteos reactivos al clic (server-side) — spec de acciones.
- Traer la lista de la tabla desde la API (`rows`, `totalCount`, `pageCount` siguen mock).
- Conectar el login y escribir `access_token` automáticamente (SPEC 03 — auth).
- Arreglar el `post<T>` roto de `HttpDataSource` y los errores preexistentes de `auth`.
- Persistir/crear marcas, modelos o herramientas (combobox sigue con mocks).

Cada uno, si aterriza, va en su propio spec.
