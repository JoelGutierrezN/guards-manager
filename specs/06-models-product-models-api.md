# SPEC 06 — Conectar el catálogo de Modelos a /product-models

> **Estado:** Implemented · **Depende de:** SPEC 03 (base de red + auth), SPEC 05 (`HttpDataSource` singleton + 401 global) · **Fecha:** 2026-07-27
> **Objetivo:** Conectar la pantalla `/dashboard/models` al recurso `/product-models` con listado paginado y filtrado server-side por marca y nombre sincronizado a la URL, más alta, edición, baja/reactivación y eliminación, dejando el resto de controles inertes y marcados como en desarrollo.

> **Precondición bloqueante (back):** este spec asume dos cosas que **hoy no existen** en el contrato entregado:
>
> 1. El `data` de listado y detalle incluye `active: boolean`.
> 2. Existe `PATCH /v1/product-models/{id}/status` con body `{ "active": false | true }` y respuesta igual a `GET /{id}`.
>
> Sin ambas, los pasos de baja/reactivación del plan quedan bloqueados; el resto (listado, filtros, alta, edición, eliminación) se puede implementar igual.

---

## Alcance

**Dentro:**

- **Capa DDD del módulo `models`** (patrón de `brands`, del que se copia la estructura):
  - `domain/`: entidad `ProductModel`, `ProductModelPage`, contrato `ProductModelRepository`, inputs de alta/edición.
  - `infraestructure/dto/` + `mappers/`: forma cruda de la API → dominio.
  - `infraestructure/repositories/product-model.repository.ts` sobre `HttpDataSource.getInstance()` (SPEC 05).
  - `application/`: estado + `useReducer` (`models-state.model.ts`, `models.reducer.ts`), helper de query params y `ProductModelService` para los cálculos derivados (porcentaje de uso, textos).
  - `hooks/use-product-models.hook.ts`: orquesta carga, filtros, modal y mutaciones.

- **Listado server-side** (`GET /v1/product-models`) con `page`, `brand_id`, `name` y `limit` por defecto (15). Las filas muestran marca, nombre del modelo, `stocksTotal`, y la barra de uso con `stocksAssigned/stocksTotal` + `usagePercentage` de la API.

- **Filtro por marca desde las tabs superiores:** seleccionar una tab (o una marca del `BrandTabPicker` de overflow) manda `brand_id` a la API y vuelve a página 1. "Todas" quita el filtro.

- **Búsqueda server-side por `name`** con debounce de 250 ms (el placeholder sigue diciendo "Buscar por código…", pero filtra por nombre del modelo).

- **Query params compartibles:** `?brand=<uuid>&name=<texto>&page=<n>`, con el mismo patrón `*-query-params.helper.ts` de `brands` (el estado inicial se hidrata desde la URL; entrar con una URL ya filtrada reproduce el mismo listado).

- **Alta y edición** (`POST` / `PUT /{id}`): el modal se llena con el select de marcas de `/brands/select`, el campo "Código de modelo" mapea a `name`, la marca de la tab activa viene preseleccionada al crear, y en edición se puede cambiar de marca. Los errores 422 se muestran **dentro del modal**, bajo el campo, sin cerrarlo.

- **Baja / reactivación** (`PATCH /{id}/status`, precondición del back):
  - Acción "Dar de baja" con icono de pulgar abajo (`ThumbsDownIcon`).
  - La **primera vez** (por usuario, persistido en `localStorage`) se muestra un modal de advertencia: dar de baja impide crear nuevos stocks y resguardos, y para eliminar el modelo hay que recolectar antes las herramientas en resguardo. Después, baja directa con toast.
  - Un modelo dado de baja se distingue en la tabla (fondo tenue, texto en `text-muted`, badge "Dado de baja") y **no admite ninguna modificación**: editar y dar de baja quedan deshabilitados; solo "Reactivar" (directo, sin confirmación) y "Eliminar".

- **Eliminación** (`DELETE /{id}`) con modal de confirmación. Si `stocksAssigned > 0` el botón queda **deshabilitado** con tooltip explicando que primero hay que recolectar las herramientas en resguardo.

- **Área de trabajo sin saltos:** la tabla y el paginador conservan siempre la misma altura y posición. Durante carga y recarga se pintan filas skeleton (tantas como `per_page`), nunca un colapso del contenedor; el `Pager` se renderiza siempre con los datos previos o en skeleton.

- **Estados:** error de carga con mensaje breve + "Reintentar"; vacío diferenciado ("aún no hay modelos" vs "sin resultados para «X»").

- **Conteos y lede:** el lede del `PageHero` usa `meta.productModels`, `meta.brands` y `meta.stocks` del propio listado; los conteos de las tabs siguen viniendo de `/brands/select` y se refrescan tras cada alta, edición, baja o eliminación.

- **Controles inertes marcados como en desarrollo** (deshabilitados + badge "En desarrollo"): botón **Exportar**, **checkboxes** de selección múltiple de la tabla y el nuevo filtro visual **"Ver dados de baja"** (se agrega la UI, no se conecta).

- **Limpieza de mocks:** eliminar `models.data.ts` (`MODELS`, `BRANDS_FILTER`, `ToolModel`, `usagePct`) y sus usos.

**Fuera de alcance (para specs futuros):**

- `POST /{id}/merge` (fusionar modelos): propuesta de UX que no entra en esta primera versión.
- Conectar el filtro "Ver dados de baja" a la API (necesita un param del back; va en su propio spec).
- Exportar el catálogo y acciones en lote sobre la selección múltiple.
- Ordenación por columna y tamaño de página configurable.
- Pantalla de detalle de un modelo.

---

## Modelo de datos

> Convención transversal: en mappers, hooks y componentes se **desestructura** (`const { data, meta } = dto`, `const { brand, stocksTotal } = model`); no se encadenan accesos tipo `dto.meta.current_page`.

### Dominio (`src/modules/models/domain/`)

```ts
// product-model.entity.ts
export interface ProductModel {
  id: string
  name: string
  brandId: string
  brandName: string
  stocksTotal: number
  stocksAssigned: number
  usagePercentage: number
  active: boolean // precondición del back
}

// product-model-page.model.ts
export interface ProductModelPage {
  models: ProductModel[]
  page: number
  perPage: number
  lastPage: number
  total: number
  modelsTotal: number // meta.productModels
  brandsTotal: number // meta.brands
  stocksTotal: number // meta.stocks
}

// product-model-query.model.ts
export interface ProductModelQuery {
  page: number
  brandId: string | null
  name: string
}

// product-model-input.model.ts
export interface CreateProductModelInput {
  name: string
  brandId: string
}
export type UpdateProductModelInput = CreateProductModelInput

// product-model-repository.ts  (contrato)
export interface ProductModelRepository {
  list(query: ProductModelQuery): Promise<ProductModelPage>
  create(input: CreateProductModelInput): Promise<ProductModel>
  update(id: string, input: UpdateProductModelInput): Promise<ProductModel>
  setActive(id: string, active: boolean): Promise<ProductModel>
  remove(id: string): Promise<void>
}
```

### DTOs (`src/modules/models/infraestructure/dto/`)

```ts
// product-model.dto.ts
export interface ProductModelBrandDto {
  id: string
  name: string
}
export interface ProductModelDto {
  id: string
  name: string
  brandId: string
  brand: ProductModelBrandDto
  stocksTotal?: number
  stocksAssigned?: number
  usagePercentage?: number
  active?: boolean
}

// product-model-item.dto.ts     → respuestas de POST, GET /{id}, PUT, PATCH /status
export interface ProductModelItemDto {
  data: ProductModelDto
}

// product-model-collection.dto.ts
export interface ProductModelCollectionDto {
  data: ProductModelDto[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    productModels: number
    brands: number
    stocks: number
  }
}
```

`links` se ignora (la paginación se arma con `meta`). Los campos opcionales del DTO se normalizan a `0` / `true` en el mapper, igual que hace `BrandMapper`.

### Estado del listado (`src/modules/models/application/`)

```ts
// models-state.model.ts
export type ModelsStatus = 'loading' | 'reloading' | 'ready' | 'error'

export interface ModelsState {
  models: ProductModel[]
  status: ModelsStatus
  error: string | null
  saving: boolean
  formError: string | null // mensaje 422 mostrado dentro del modal
  pendingId: string | null // fila con baja/reactivación/eliminación en curso
  page: number
  perPage: number
  lastPage: number
  total: number
  modelsTotal: number
  brandsTotal: number
  stocksTotal: number
  query: string
  brandId: string | null
}

export type ModelsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; result: ProductModelPage }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_QUERY'; query: string } // resetea page a 1
  | { type: 'SET_BRAND'; brandId: string | null } // resetea page a 1
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; message: string }
  | { type: 'SAVE_DONE' }
  | { type: 'ROW_START'; id: string }
  | { type: 'ROW_DONE' }

const DEFAULT_PAGE_SIZE = 15
```

```ts
// models-window.model.ts
export type ModelsWindow = 'create' | 'edit' | 'deactivate' | 'delete'
export interface ModelsWindowManager {
  window: ModelsWindow
  payload: ProductModel | null
}
```

### Query params

`ModelsQueryParamsHelper` (en `infraestructure/helpers/`), gemelo de `BrandsQueryParamsHelper`:

| Param URL | Estado    | Se omite cuando                  |
| --------- | --------- | -------------------------------- |
| `page`    | `page`    | `page === 1`                     |
| `name`    | `query`   | `query === ''`                   |
| `brand`   | `brandId` | `brandId === null` (tab "Todas") |

`brand` **ya lo escribe `useModelBrandTabs`** (hoy existente). Para no tener dos escritores del mismo param, `useProductModels` **lee** `brandId` de la URL y solo escribe `page` y `name`; la selección de tab sigue siendo la única fuente que escribe `brand`.

### Persistencia de la advertencia de baja

```ts
// src/modules/models/infraestructure/storage/deactivate-warning.storage.ts
// misma forma que AuthSessionStorage (clase con métodos estáticos)
const KEY = 'models_deactivate_warning_seen'
export class DeactivateWarningStorage {
  static hasSeen(): boolean
  static markSeen(): void
}
```

### Rutas (relativas a `API_BASE_URL`)

- `GET /product-models?page=&brand_id=&name=`
- `POST /product-models` · body `{ name, brand_id }`
- `PUT /product-models/{id}` · body `{ name, brand_id }`
- `DELETE /product-models/{id}`
- `PATCH /product-models/{id}/status` · body `{ active }` _(precondición del back)_

> Igual que en SPEC 04: la doc escribe `/v1/...` pero `VITE_API_URL` ya incluye `/api/v1`, así que la ruta relativa va **sin** `/v1`.

### Mocks a eliminar

- `src/modules/models/infraestructure/data/models.data.ts` completo (`MODELS`, `BRANDS_FILTER`, `ToolModel`, `usagePct`). `usagePct` se reemplaza por `usagePercentage` de la API; el resto queda cubierto por el dominio.

---

## Plan de implementación

> **Precondición:** pasos 1-7 y 9-12 no dependen del back nuevo. El **paso 8** (baja/reactivación) queda bloqueado hasta que exista `active` en el payload y `PATCH /product-models/{id}/status`.

1. **Dominio.** Crear en `models/domain/`: `product-model.entity.ts`, `product-model-page.model.ts`, `product-model-query.model.ts`, `product-model-input.model.ts` y el contrato `product-model-repository.ts`. Verificación: `npx tsc -b` limpio (nada los consume todavía).

2. **DTOs y mapper.** Crear `infraestructure/dto/` (`product-model.dto.ts`, `product-model-item.dto.ts`, `product-model-collection.dto.ts`) y `infraestructure/mappers/product-model.mapper.ts` con `toProductModel(dto)` y `toProductModelPage(dto)`, desestructurando `{ data, meta }` y `{ brand, ... }`, y normalizando opcionales (`?? 0`, `active ?? true`).

3. **Repositorio.** `infraestructure/repositories/product-model.repository.ts`: clase que implementa el contrato sobre `HttpDataSource.getInstance()`, arma la query con `URLSearchParams` (omite `brand_id`/`name` vacíos) y exporta el singleton `productModelRepository`. Verificación: `tsc -b` limpio.

4. **Estado.** `application/models-state.model.ts` (estado + acciones + `INITIAL_MODELS_STATE`), `application/models.reducer.ts`, `application/models-window.model.ts` y `infraestructure/helpers/models-query-params.helper.ts` (hidratar desde `page`/`name`/`brand`, serializar `page`/`name`).

5. **Hook de listado.** `hooks/use-product-models.hook.ts`: `useReducer` hidratado desde la URL, carga con debounce de 250 ms ante cambios de `page`/`query`/`brandId`, `reload()` con `requestRef` (patrón de `useBrands`), escritura de `page`/`name` a la URL, y `brandId` recibido por parámetro desde `useModelBrandTabs`. Expone `state`, `showSkeletons`, `skeletonSlots`, `setPage`, `setQuery`, `reload`.

6. **Tabla conectada.** Extraer `ModelRow` a `infraestructure/components/model-row.component.tsx` (un componente por archivo) tipado con `ProductModel`; crear `model-row-skeleton.component.tsx`. En `models.page.tsx`: consumir el hook, renderizar filas reales, skeletons durante `loading`/`reloading` con la **misma altura de fila**, `Pager` siempre montado con `state.page`/`state.lastPage`/`state.total`, contenedor con altura reservada (`min-h` calculada a partir de `perPage`) para que nada haga resize; bloque de error con "Reintentar" y vacíos diferenciados. El lede usa `const { modelsTotal, brandsTotal, stocksTotal } = state`. Clases dinámicas de fila con `useMemo`. Verificación manual: filtrar por tab y por texto, paginar, recargar con la URL ya filtrada.

7. **Modal de alta/edición.** Reescribir `new-model-modal.component.tsx`: select de marcas alimentado por `/brands/select` (opciones recibidas por props desde la página, que ya las tiene de `useModelBrandTabs`), preselección de la marca de la tab activa al crear, campo "Código de modelo" → `name`, y render del `formError` bajo el campo. En el hook: `saveModel` (create/update según `windowManager`), que ante 422 despacha `SAVE_ERROR` con el mensaje del back sin cerrar el modal, y ante éxito cierra, recarga listado y refresca las tabs.

8. **Baja y reactivación** _(bloqueado por el back)_. Añadir `setActive` al flujo: acción `ThumbsDownIcon` "Dar de baja" en la fila; `deactivate-model-modal.component.tsx` con la advertencia (no permitirá nuevos stocks ni resguardos; para eliminar hay que recolectar antes las herramientas), mostrado solo si `DeactivateWarningStorage.hasSeen()` es `false`, marcando la bandera al confirmar. Estilo de fila inactiva (fondo tenue, `text-muted`, `Chip` "Dado de baja"), con editar y dar de baja **deshabilitados** y "Reactivar" directo. `ROW_START`/`ROW_DONE` para el estado de fila en curso.

9. **Eliminación.** `delete-model-modal.component.tsx` de confirmación; `removeModel` en el hook (DELETE → recarga listado + tabs, toast). El `IconButton` de eliminar se deshabilita cuando `stocksAssigned > 0`, con tooltip: hay que recolectar las herramientas en resguardo primero. Si la página queda vacía tras borrar el último elemento y `page > 1`, retroceder una página.

10. **Controles en desarrollo.** Botón "Exportar" deshabilitado con `Chip` "En desarrollo"; checkboxes de cabecera y de fila deshabilitados con el mismo distintivo (tooltip o nota en la cabecera de la tabla); filtro visual "Ver dados de baja" añadido junto al buscador, togglea su estado visual pero no filtra ni manda params, marcado igual.

11. **Limpieza.** Eliminar `infraestructure/data/models.data.ts` y todos sus imports (`MODELS`, `BRANDS_FILTER`, `ToolModel`, `usagePct`); actualizar `models/infraestructure/index.ts` si hace falta.

12. **Verificación final.** `npx tsc -b`, `npx eslint` y `npx vite build` sin errores nuevos. Prueba manual con sesión iniciada: listar, filtrar por tab y por nombre, paginar, compartir la URL filtrada y reproducir el mismo listado, crear, editar, provocar un 422 (nombre duplicado), dar de baja (primera vez con advertencia, segunda sin), reactivar, intentar eliminar con `stocksAssigned > 0` (deshabilitado) y eliminar uno sin stocks asignados. Con la API apagada: skeletons y luego error con "Reintentar", sin saltos de layout.

---

## Criterios de aceptación

**Listado y filtros**

- [ ] La tabla se llena desde `GET /product-models`; no queda ningún import de `models.data.ts` en el módulo.
- [ ] Seleccionar una marca en las tabs (o en el `BrandTabPicker` de overflow) envía `brand_id` y vuelve a la página 1; "Todas" quita el filtro.
- [ ] Escribir en el buscador envía `name` a la API con 250 ms de debounce (no una petición por tecla) y vuelve a la página 1.
- [ ] Paginar envía `page`; el `Pager` muestra `meta.current_page`, `meta.last_page` y `meta.total` reales.
- [ ] La URL refleja el estado: `?brand=<uuid>&name=<texto>&page=<n>`, omitiendo cada param en su valor por defecto; abrir esa URL en una pestaña nueva reproduce el mismo listado, la misma tab activa y el mismo texto en el buscador.
- [ ] Cada fila muestra marca, nombre del modelo, `stocksTotal`, y la barra de uso con `stocksAssigned/stocksTotal` y el `usagePercentage` de la API (no un porcentaje calculado en el front).
- [ ] El lede del `PageHero` usa `meta.productModels`, `meta.brands` y `meta.stocks`.
- [ ] Los conteos de las tabs se refrescan tras crear, editar, dar de baja, reactivar o eliminar un modelo.

**Estabilidad del layout**

- [ ] Durante la carga inicial y durante cada recarga, la tabla muestra filas skeleton de la misma altura que las filas reales; el contenedor no cambia de alto.
- [ ] El `Pager` está siempre montado y en la misma posición en carga, recarga, error y estado vacío.
- [ ] Cambiar de tab, buscar o paginar no produce ningún salto vertical de la sección ni del paginador.

**Alta y edición**

- [ ] El select de marca del modal se llena desde `/brands/select` (ya no de `BRANDS_FILTER`).
- [ ] Con una marca seleccionada en las tabs, al abrir "Nuevo modelo" esa marca viene preseleccionada.
- [ ] En edición se puede cambiar la marca del modelo y el `PUT` manda `brand_id`.
- [ ] El campo "Código de modelo" se envía como `name`.
- [ ] Un 422 muestra el mensaje del back **dentro del modal**, bajo el campo, y el modal **no** se cierra ni se pierde lo escrito.
- [ ] Tras guardar con éxito, el modal se cierra, el listado se recarga y se muestra un toast.

**Baja y reactivación**

- [ ] La fila ofrece "Dar de baja" con icono de pulgar abajo (`ThumbsDownIcon`).
- [ ] La **primera** baja (por usuario) muestra el modal de advertencia: no se podrán crear nuevos stocks ni resguardos, y para eliminar hay que recolectar antes las herramientas en resguardo.
- [ ] La bandera queda persistida en `localStorage`; a partir de la segunda baja la acción se ejecuta directa con toast, y sigue sin aparecer tras recargar la página.
- [ ] Un modelo dado de baja se distingue visualmente (fondo tenue, texto en `text-muted`, badge "Dado de baja") sin romper el lenguaje visual de la pantalla.
- [ ] En un modelo dado de baja, editar y dar de baja están **deshabilitados**; solo quedan "Reactivar" y "Eliminar".
- [ ] "Reactivar" ejecuta el `PATCH` directo, sin modal de confirmación, y la fila vuelve a su aspecto normal.

**Eliminación**

- [ ] Eliminar pide confirmación en un modal antes de llamar al `DELETE`.
- [ ] Con `stocksAssigned > 0`, el botón eliminar está deshabilitado y su tooltip explica que primero hay que recolectar las herramientas en resguardo.
- [ ] Con `stocksAssigned === 0`, eliminar borra el registro, recarga el listado y muestra un toast.
- [ ] Si se elimina el último registro de una página con `page > 1`, la vista retrocede una página en vez de quedar vacía.

**Controles en desarrollo y estados**

- [ ] "Exportar", los checkboxes de la tabla y el filtro "Ver dados de baja" están deshabilitados y marcados con un badge "En desarrollo"; ninguno dispara peticiones.
- [ ] Si la carga falla, se muestra un mensaje breve con botón "Reintentar" que vuelve a disparar la petición con los filtros vigentes.
- [ ] Sin resultados por búsqueda se muestra "sin resultados para «X»"; sin modelos en absoluto, un vacío distinto.
- [ ] `npx tsc -b`, `npx eslint` y `npx vite build` sin errores nuevos.

---

## Decisiones tomadas y descartadas

**Alcance del contrato**

- **Sí:** Fijar como precondición del back `active: boolean` en el payload y `PATCH /product-models/{id}/status`. La baja es un requisito del usuario y sin estado persistido en la API el front solo podría fingirla; se prefiere bloquear ese paso a inventar una baja local.
- **No:** Guardar las bajas en `localStorage` o en un mock mientras llega el endpoint. Sería un estado por navegador, invisible para el resto del sistema, y contradice la regla de CLAUDE.md de borrar mocks al integrar.
- **No:** Implementar `POST /{id}/merge`. Es una propuesta de UX que el usuario descartó para esta primera versión; el endpoint existe pero la pantalla no lo expondrá.
- **Sí:** Añadir el filtro "Ver dados de baja" solo como UI inerte. Deja el hueco visual resuelto y aísla en otro spec la negociación del param con el back.

**Filtros y URL**

- **Sí:** Filtrado y búsqueda **server-side**, con la URL como fuente compartible (`brand`, `name`, `page`). Replica el patrón ya probado en `brands` y permite compartir un listado ya filtrado.
- **No:** Mantener el filtrado en cliente sobre la página actual. Con paginación server-side daría resultados incoherentes (solo filtraría los 15 registros visibles).
- **Sí:** `useModelBrandTabs` sigue siendo el **único** escritor del param `brand`; `useProductModels` lo lee y solo escribe `page` y `name`. Dos hooks escribiendo el mismo param se pisarían al hacer merge de query params.
- **Sí:** `limit` por defecto (15) sin exponerlo en la UI. Es el máximo del contrato; hacerlo configurable no aporta nada hoy.

**Baja y eliminación**

- **Sí:** Decidir en el front si se puede eliminar, usando `stocksAssigned > 0` (dato que ya viene en el listado) para deshabilitar el botón. Evita ofrecer una acción que va a fallar y explica el porqué antes del clic.
- **No:** Dejar el botón siempre activo y confiar en un 409/422 del back. Convierte una regla conocida de antemano en un error a posteriori.
- **Sí:** Advertencia de baja **solo la primera vez por usuario**, persistida en `localStorage`. Es lo que pidió el usuario: educar una vez, no estorbar después.
- **No:** Confirmar cada baja. Sería fricción repetida en una acción reversible (existe "Reactivar").
- **Sí:** Confirmar **siempre** la eliminación. Es destructiva e irreversible, a diferencia de la baja.
- **Sí:** Un modelo dado de baja no admite ninguna modificación (editar y dar de baja deshabilitados). Decisión explícita del usuario; mantiene un estado congelado y sin ambigüedad.
- **Sí:** Reactivar sin confirmación. No es destructivo y devuelve el modelo a su estado normal.

**UI**

- **Sí:** Área de trabajo de altura fija con filas skeleton durante carga y recarga. Requisito explícito: "siempre la misma área de trabajo", sin resize.
- **No:** Spinner centrado que reemplaza la tabla. Colapsa el contenedor y provoca justo el salto que se quiere evitar.
- **Sí:** Errores 422 dentro del modal, bajo el campo. El error pertenece al formulario; cerrarlo obligaría a reescribir los datos.
- **No:** Toast de error para el 422. Se pierde el contexto del campo que falló.
- **Sí:** Marcar Exportar, checkboxes y filtro de bajas como deshabilitados con badge "En desarrollo". Es honesto con el usuario final y evita reportes de "no funciona".
- **No:** Ocultar esos controles. El diseño ya los contempla; esconderlos degradaría la pantalla frente al mock de referencia.
- **Sí:** El modal recibe las marcas por props desde la página. `useModelBrandTabs` ya las trajo de `/brands/select`; pedirlas otra vez sería una llamada redundante.
- **Sí:** `usagePercentage` de la API en vez de calcularlo en el front (se elimina `usagePct`). Una sola fuente de verdad para el número que se muestra.

**Arquitectura**

- **Sí:** Copiar la estructura DDD de `brands` (domain / application con reducer / infraestructure con dto, mapper, repositorio, helper / hooks). Es el patrón vigente del proyecto y hace el módulo predecible.
- **No:** Casos de uso separados por endpoint. Igual que en SPEC 04, añaden capas sin valor para un CRUD; repositorio + hook bastan.
- **Sí:** Desestructurar en mappers, hooks y componentes en lugar de encadenar accesos (`dto.meta.current_page`). Petición explícita del usuario, aplicada en todo el spec.

---

## Riesgos identificados

| Riesgo                                                                                                                                                                                                                      | Mitigación                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| El endpoint de baja (`PATCH /{id}/status`) y el campo `active` **no existen todavía**; si el back los entrega con otra forma (ej. `DELETE` lógico, `deactivated_at`, `status: 'inactive'`), el paso 8 hay que reescribirlo. | Está declarado como precondición bloqueante en el encabezado. El resto del plan (pasos 1-7 y 9-12) no depende de ello y se puede implementar y entregar antes. El impacto queda acotado al mapper, al repositorio y a la acción de fila. |
| La forma exacta del **422** no está documentada; se asume Laravel (`{ message, errors: { name: [...] } }`). Si difiere, el modal mostraría un mensaje vacío o `undefined`.                                                  | El mapeo del error se hace en un solo punto con fallback a un mensaje genérico ("No se pudo guardar el modelo") cuando no se reconoce la forma; se verifica manualmente provocando un nombre duplicado.                                  |
| El contrato documenta `brand_id`, `name` y `limit`, pero no `page`; si `page` se comportara distinto de lo confirmado, la paginación quedaría rota en silencio (siempre la primera página).                                 | El usuario confirmó que `page` funciona. La verificación manual del paso 12 incluye paginar y comprobar que `meta.current_page` avanza.                                                                                                  |
| Dos hooks (`useModelBrandTabs` y `useProductModels`) conviven sobre los mismos query params; un cambio futuro que haga escribir `brand` también al segundo provocaría peticiones dobles o filtros que se pisan.             | Queda como decisión escrita: `brand` lo escribe solo `useModelBrandTabs`. El hook de listado recibe `brandId` por parámetro, no lo deriva por su cuenta.                                                                                 |
| `stocksAssigned` puede quedar desactualizado respecto al back (otro usuario devuelve herramientas en paralelo), habilitando o deshabilitando "Eliminar" con datos viejos.                                                   | Tras cada mutación se recarga el listado. Si aun así el `DELETE` falla, el error se muestra en un toast; el estado se corrige con "Reintentar"/recarga.                                                                                  |
| La altura fija de la tabla calculada a partir de `perPage` puede desalinearse si el back devuelve un `per_page` distinto de 15 o una última página corta.                                                                   | La altura se reserva con el `perPage` del estado (que se sincroniza con `meta.per_page`) y las filas skeleton usan la misma altura que las reales; la última página corta rellena con espacio, no con salto.                             |
| Los conteos de las tabs vienen de `/brands/select` y el lede de `meta` del listado: son dos fuentes que pueden mostrar números distintos por un instante tras una mutación.                                                 | Ambas se refrescan tras cada mutación; la ventana de desincronización es la de una recarga y no bloquea ninguna acción.                                                                                                                  |

---

## Lo que **no** está en este spec

- `POST /{id}/merge` (fusionar modelos).
- Conectar el filtro "Ver dados de baja" a la API.
- Exportar el catálogo y acciones en lote sobre la selección múltiple.
- Ordenación por columna y tamaño de página configurable.
- Pantalla de detalle de un modelo.

Cada cosa pendiente, si aterriza, va en su propio spec.
