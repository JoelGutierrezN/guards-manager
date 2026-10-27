# SPEC 07 — Login y series en resguardos

> **Estado:** Aprobada · **Depende de:** SPEC 03, SPEC 05 y contrato de series de Guards API · **Fecha:** 2026-10-27
> **Objetivo:** Alinear el login con la interfaz actual y exigir una serie única y permanente por bien al crear resguardos, con correcciones auditadas y acuse cuando está asignado.

## Alcance

**Dentro:**

- Rediseñar exclusivamente el login con tokens y componentes existentes, adaptable a móvil y escritorio.
- Conservar autenticación, errores, mantener sesión, recuperación y redirección original.
- Guardar una serie nullable por unidad de inventario.
- Pedir serie al crear cualquier resguardo cuando la unidad no tiene una, incluidas unidades históricas.
- Mostrar y reutilizar una serie existente sin pedirla otra vez.
- Permitir corrección de serie en inventario, incluso con resguardo activo.
- Validar unicidad global al registrar y corregir, incluidas unidades dadas de baja.
- Generar acuse PDF independiente si se corrige una unidad asignada, con responsable, serie anterior y nueva.
- Descargar e imprimir manualmente el acuse; permitir reimpresión posterior.
- Conservar condición, historial del bien y documentos originales.

**Fuera de alcance:**

- Enviar correos o notificaciones externas.
- Rediseñar recuperación de contraseña, layouts compartidos o el kit global.
- Inferir la necesidad de serie de la condición NUEVO o del historial de primera entrega.
- Reescribir PDFs originales o corregir automáticamente series existentes.

## Reglas y modelo de datos

- La serie pertenece al bien permanentemente; solo su ausencia determina la captura obligatoria.
- La serie canónica se normaliza con trim y mayúsculas, con longitud máxima de 255 caracteres.
- Una serie asignada a otra unidad no puede reutilizarse.
- Actualizar la propia unidad no colisiona consigo misma.
- Un valor vacío en resguardos posteriores nunca borra la serie guardada.
- El alta de resguardo no modifica una serie existente: se usa la acción explícita de corrección.
- La corrección conserva condición y asignación; la serie anterior queda auditada.
- Una operación fallida conserva el carrito y asocia el error a la unidad.

Contrato coordinado con la API:

- Stock.serial: string | null.
- CustodyItem.serialAtAssignment: string | null conserva la serie al momento de entrega.
- POST /custodies acepta items[].serial; lo exige si el stock aún no tiene serie. Errores 422 en items.i.serial.
- POST /stocks/{stock}/serial-corrections acepta serial, expected_serial y reason opcional.
- La respuesta 201 incluye stock y correction con id, previousSerial, newSerial, reason, createdAt, createdBy, custody, responsible y receipt.
- receipt es null si no hay resguardo activo; de otro modo contiene id, filename, url y sizeBytes.
- Un expected_serial desactualizado devuelve 409 con message y currentSerial.
- GET /stocks/{stock}/serial-corrections devuelve historial paginado.
- GET /stocks/{stock}/serial-corrections/{correction}/receipt entrega el PDF privado para descarga y reimpresión.

## Diseño de interfaz

- Login: fondo crema, panel lavanda, títulos Instrument Serif, detalles JetBrains Mono y botones del kit; dos columnas en escritorio y una en móvil.
- Confirmación de resguardo: campo Número de serie obligatorio por unidad sin serie; serie registrada visible y reutilizada para las demás.
- Inventario: acción contextual Corregir serie y modal con serie actual, nueva serie y confirmación explícita.
- Si está asignado, el modal avisa de la generación del acuse para el responsable y de su entrega manual.
- Tras corregir, ofrecer Descargar acuse y acceso persistente a Reimprimir acuse desde la unidad.
- Reutilizar Modal, FormField, Input, Button, Toast y estilos existentes; no crear un módulo global.

## Plan de implementación

1. Rediseñar auth.page.tsx y auth-form.component.tsx sin cambiar infraestructura de autenticación.
2. Añadir persistencia, normalización, unicidad y snapshots de serie en Guards API.
3. Extender DTO, mappers y modelos de stocks y resguardos con el contrato aprobado.
4. Incorporar captura de series faltantes y validación al paso Confirmación del wizard.
5. Implementar corrección contextual, concurrencia y errores por campo en inventario.
6. Generar acuse independiente para corrección asignada y conectar descarga e historial de reimpresión.

Cada paso debe dejar el sistema ejecutable. El trabajo permanece en main por instrucción explícita del usuario, sin commits ni push automáticos.

## Criterios de aceptación

- [ ] Login legible en escritorio y móvil, sin desbordamiento horizontal.
- [ ] Credenciales, mantener sesión, recuperación, errores y redirección conservan su comportamiento.
- [ ] Una unidad sin serie bloquea la creación del resguardo hasta completar una serie válida.
- [ ] Una unidad histórica sin serie exige captura igual que cualquier otra.
- [ ] Una unidad con serie la muestra y reutiliza sin solicitar captura.
- [ ] Un carrito mixto permite capturar solo las series faltantes.
- [ ] Series duplicadas fallan tanto al registrar como al corregir y se muestra error contextual.
- [ ] Una actualización de la propia unidad no colisiona consigo misma.
- [ ] Corregir una serie funciona con unidad libre o asignada y no cambia su condición.
- [ ] Una corrección concurrente desactualizada se informa sin sobrescribir la serie actual.
- [ ] Devolver y reasignar conserva la serie del bien.
- [ ] Corregir una unidad asignada produce PDF separado con responsable y series anterior/nueva.
- [ ] El acuse se puede descargar y reimprimir tras recargar la aplicación.
- [ ] La corrección conserva el snapshot y los documentos originales del resguardo.
- [ ] Ningún flujo envía email ni mensajes externos.

## Decisiones

- Usar el kit compartido existente sin modificarlo para rediseñar login.
- Exigir serie por ausencia, nunca por condición o primera entrega.
- Persistir en el servidor con unicidad global y control de concurrencia.
- Permitir correcciones explícitas auditadas en vez de bloquear por asignación.
- Conservar documentos originales y emitir acuse independiente.
- Aprobación explícita del usuario: «Márcala como aprobada e impleméntala»; autoriza el nombre y la implementación en main.

## Riesgos

- Las unidades históricas pueden carecer de serie: la siguiente entrega exige completarla.
- Un cambio concurrente puede dejar la vista desactualizada: expected_serial evita sobrescrituras.
- La generación de PDF debe ser consistente con la corrección persistida y mantener descarga privada.

## Fuera de esta spec

No incluye envío de correo, rediseño global ni modificación retroactiva de documentos originales.
