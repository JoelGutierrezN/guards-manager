# Guards Manager — Memoria del proyecto

## Proyecto

- **Framework:** React 19 + Vite + TypeScript
- **Estilos:** Tailwind CSS v4 — configurado vía directiva `@theme` en `src/index.css`; **no existe `tailwind.config.js/ts`**.
- **Componentes UI:** HeroUI
- **Iconos:** Hugeicons — paquetes `@hugeicons/react` y `@hugeicons/core-free-icons`
- **Routing:** react-router v7
- **Gestor de paquetes:** pnpm
- **Idioma de UI y documentación:** español

## Arquitectura

Estructura modular inspirada en DDD:

```
src/modules/<feature>/
  domain/          # entidades, modelos, interfaces de dominio
  application/     # casos de uso, lógica de aplicación
  hooks/           # custom hooks (*.hook.ts)
  infraestructure/ # componentes, servicios, helpers, adaptadores
```

Módulos actuales: `auth`, `shared`, `tools`, `brands`, `models`, `employees`.
Módulos previstos (fases siguientes): `inventory`, `custodies`, `account`, `dashboard`.

Componentes UI compartidos: `src/modules/shared/infraestructure/components/ui/` — usa siempre este kit propio primero. De HeroUI solo están permitidas las primitivas ya importadas en el proyecto: `useOverlayState`, `ScrollShadow`, `Spinner`, `Button`, `Chip`, `Form`, `TextField`, `Input`, `Label`, `FieldError`. No introducir otras primitivas de HeroUI.

Sin mocks ni `// TODO API`: todo dato viene de `HttpDataSource`. Implementación de referencia: `src/modules/employees` (repositorio en `domain/*-repository.ts`, implementación HTTP en `infraestructure/repositories`, DTO + mapper, hook con reducer, helper de query params, página que compone componentes).

### Convención de nombres de archivos

| Tipo        | Sufijo            |
| ----------- | ----------------- |
| Componente  | `*.component.tsx` |
| Hook        | `*.hook.ts`       |
| Service     | `*.service.ts`    |
| Helper      | `*.helper.ts`     |
| Modelo/tipo | `*.model.ts`      |
| Entidad     | `*.entity.ts`     |

## Reglas de código (obligatorias)

1. No usar comentarios para explicar lo obvio del código.
2. Si un componente tiene muchos estados relacionados, evaluar `useReducer` en lugar de varios `useState`.
3. Un solo componente por archivo.
4. No definir variables dentro de los bloques `.map()` del JSX; el map solo retorna un componente/elemento — extrae un subcomponente.
5. Ninguna variable de una sola letra (`v`, `a`, `s`, `n`…); nombres descriptivos. Respetar CLEAN y SOLID.
6. En el archivo de un componente solo se define la interfaz `Props`; los demás tipos/interfaces van en archivos aparte (`*.model.ts`).
7. Las clases CSS dinámicas se calculan y memorizan (`useMemo`) en el cuerpo del componente, no como ternarios sueltos dentro del JSX.
8. Si un componente tiene mucha lógica, extraerla a un custom hook; si es un proceso muy complejo, a un service.
9. Funciones reutilizables se definen como helpers (DRY, no repetir).
10. Helpers, objetos y services se implementan como clases con responsabilidad única (SRP).

## Más detalle

Ver ejemplos de código (✅/❌) para cada regla en:
`.claude/skills/react-ts-standards/SKILL.md`
