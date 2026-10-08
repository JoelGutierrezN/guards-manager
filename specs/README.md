# Estado de las especificaciones

Revisión: 2026-10-08. Rama de integración: `development`.

Los checklists de junio y julio son históricos. Varias fases de septiembre sustituyeron sus contratos y decisiones de interfaz; una casilla vacía no demuestra que falte la función.

| Spec                            | Estado contrastado                                                                                                                                                                   | Evidencia                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 01 y 02: diseño de Herramientas | Sustituidos en su parte funcional por las fases 1 y 7: catálogo, CRUD, filtros, ordenación e importación reales.                                                                     | `tools.spec.ts`, `stock-in.spec.ts`, `product-import.spec.ts`.                           |
| 03: autenticación y middlewares | Implementado: `identifier`, `token`, `user.id`, `expiresAt`, Bearer y sesión persistida.                                                                                             | Módulo `auth`, `HttpDataSource`, `smoke.spec.ts`, `account.spec.ts`.                     |
| 04: estadísticas y catálogo     | Implementado y ampliado: las filas y filtros ya consultan la API; las instrucciones de conservar mocks quedaron superadas.                                                           | Repositorios de `tools`, `tools.spec.ts`, `stock-in.spec.ts`.                            |
| 05: sesión expirada             | Implementado en el interceptor y `AuthMiddleware`; no hay una prueba E2E dedicada a todos los criterios de 401.                                                                      | `http.datasource.ts`, `auth.middleware.tsx`, almacenamiento y reducer de sesión.         |
| 06: modelos y marcas            | Integración real, baja/reactivación, preview de borrado, filtros y exportación. La política antigua de ocultar la advertencia después de la primera baja fue sustituida por el plan. | Módulos `models`/`brands`, `brands-models-advanced.spec.ts` y pruebas Feature de la API. |

Esto confirma la implementación del alcance principal, no una certificación individual de cada criterio visual ni cero deuda. Persisten deuda de accesibilidad de modales/Drawer y diferencias con issues originales, documentadas en el [informe conjunto](https://github.com/JoelGutierrezN/guards-planning/blob/trunk/reportes/2026-10-08-consolidacion-development.md).

El [plan de implementación](https://github.com/JoelGutierrezN/guards-planning/blob/trunk/02-plan-implementacion.md) y los contratos reales prevalecen sobre los mocks, rutas `/dashboard/tools` y decisiones de los primeros diseños.
