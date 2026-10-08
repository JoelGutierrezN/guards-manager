---
name: react-ts-standards
description: >
  Estándares obligatorios de código para este proyecto. Se activa automáticamente cuando
  se escribe o edita cualquier componente React/TSX, hook personalizado, service, helper,
  o cualquier archivo relacionado con la arquitectura modular del proyecto (*.component.tsx,
  *.hook.ts, *.service.ts, *.helper.ts, *.model.ts, *.entity.ts). Aplica principios CLEAN
  y SOLID, nomenclatura descriptiva, estructura de archivos por responsabilidad única y
  patrones de optimización (useMemo, useReducer, custom hooks). Usar siempre que se trabaje
  con componentes React, hooks, services, helpers o estándares de código en este proyecto.
---

# Estándares de código React/TypeScript — Guards Manager

Este proyecto sigue 10 reglas de código **obligatorias**. Se aplican en toda modificación o
creación de componentes React/TSX, hooks, services y helpers. El stack es:
React 19 + TypeScript + Tailwind CSS v4 + HeroUI + Hugeicons (`@hugeicons/react`).

---

## 1. No comentarios para lo obvio

No escribir comentarios que expliquen lo que el código ya dice claramente.

```tsx
// ❌
// Incrementar el contador
setCount(count + 1)

// ✅ — el código habla por sí solo
setCount(count + 1)

// ✅ — comentario útil: explica el POR QUÉ, no el QUÉ
// Se usa `count + 1` en lugar de la función de actualización para mantener
// sincronía con el log externo que lee el valor en el mismo frame.
setCount(count + 1)
```

---

## 2. `useReducer` cuando hay muchos estados relacionados

Si un componente acumula 3 o más `useState` relacionados, evaluar `useReducer`.

```tsx
// ❌
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
const [data, setData] = useState<Guard[]>([])

// ✅
type GuardListState = {
  isLoading: boolean
  error: string | null
  data: Guard[]
}

type GuardListAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Guard[] }
  | { type: 'FETCH_ERROR'; payload: string }

function guardListReducer(state: GuardListState, action: GuardListAction): GuardListState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null }
    case 'FETCH_SUCCESS':
      return { isLoading: false, error: null, data: action.payload }
    case 'FETCH_ERROR':
      return { isLoading: false, error: action.payload, data: [] }
  }
}

const [state, dispatch] = useReducer(guardListReducer, { isLoading: false, error: null, data: [] })
```

---

## 3. Un solo componente por archivo

Cada archivo `.component.tsx` exporta **un único** componente.

```tsx
// ❌ — guardCard.component.tsx con dos componentes
export function GuardCardHeader() { ... }
export function GuardCard() { ... }

// ✅ — guard-card-header.component.tsx
export function GuardCardHeader() { ... }

// ✅ — guard-card.component.tsx
export function GuardCard() { ... }
```

---

## 4. Sin variables dentro de `.map()` en JSX

El callback de `.map()` solo retorna un elemento/componente. Si necesitas derivar datos,
extrae un subcomponente y pásale los datos como props.

```tsx
// ❌
{
  guards.map((guard) => {
    const fullName = `${guard.firstName} ${guard.lastName}`
    const badgeColor = guard.status === 'active' ? 'green' : 'red'
    return <span style={{ color: badgeColor }}>{fullName}</span>
  })
}

// ✅ — extrae GuardRow y calcula ahí
{
  guards.map((guard) => <GuardRow key={guard.id} guard={guard} />)
}
```

---

## 5. Nombres descriptivos — sin variables de una letra

Ninguna variable, parámetro ni función puede usar nombres de una sola letra (`v`, `a`, `s`, `n`, `i` como variable de datos, etc.). Respetar CLEAN y SOLID.

```tsx
// ❌
const n = guards.length
guards.forEach((g) => console.log(g.name))

// ✅
const guardCount = guards.length
guards.forEach((guard) => console.log(guard.name))
```

> Excepción aceptada: índices en bucles estrictamente numéricos (`i`, `j`) cuando el contexto es inequívoco y no se usa para lógica de negocio. En React, preferir siempre un nombre semántico.

---

## 6. Solo la interfaz `Props` en el archivo del componente

Tipos e interfaces de dominio van en archivos `*.model.ts` o `*.entity.ts`. El archivo
del componente declara únicamente la interfaz `Props` (o `type Props`).

```tsx
// ❌ — guard-card.component.tsx
interface Guard { id: string; name: string; status: 'active' | 'inactive'; }
interface GuardCardProps { guard: Guard; }
export function GuardCard({ guard }: GuardCardProps) { ... }

// ✅ — guard.model.ts
export interface Guard { id: string; name: string; status: 'active' | 'inactive'; }

// ✅ — guard-card.component.tsx
import type { Guard } from '../domain/guard.model';
interface Props { guard: Guard; }
export function GuardCard({ guard }: Props) { ... }
```

---

## 7. Clases CSS dinámicas con `useMemo`

Las clases condicionales se calculan en el cuerpo del componente con `useMemo`,
no como ternarios sueltos dentro del JSX.

```tsx
// ❌
<div className={`p-4 rounded ${guard.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>

// ✅
const statusClassName = useMemo(
  () =>
    guard.status === 'active'
      ? 'p-4 rounded bg-green-100 text-green-800'
      : 'p-4 rounded bg-red-100 text-red-800',
  [guard.status],
);

return <div className={statusClassName}>
```

---

## 8. Lógica compleja a custom hooks o services

Un componente renderiza y delega. Si crece en lógica, extraer:

- **Custom hook** (`*.hook.ts`): lógica de estado/efectos reutilizable.
- **Service** (`*.service.ts`): procesos complejos, llamadas a API, transformaciones de datos.

```tsx
// ❌ — todo en el componente
export function GuardList() {
  const [guards, setGuards] = useState<Guard[]>([]);
  useEffect(() => {
    fetch('/api/guards').then(r => r.json()).then(setGuards);
  }, []);
  const activeGuards = guards.filter(g => g.status === 'active');
  ...
}

// ✅ — lógica delegada al hook
// use-guard-list.hook.ts
export function useGuardList() {
  const [guards, setGuards] = useState<Guard[]>([]);
  useEffect(() => { GuardService.fetchAll().then(setGuards); }, []);
  const activeGuards = useMemo(() => guards.filter(g => g.status === 'active'), [guards]);
  return { activeGuards };
}

// guard-list.component.tsx
export function GuardList() {
  const { activeGuards } = useGuardList();
  return <ul>{activeGuards.map(guard => <GuardRow key={guard.id} guard={guard} />)}</ul>;
}
```

---

## 9. Funciones reutilizables como helpers (DRY)

No repetir la misma lógica en varios lugares. Extraer a `*.helper.ts` con responsabilidad única.

```tsx
// ❌ — misma lógica en dos componentes
// En GuardCard: const label = `${guard.firstName} ${guard.lastName}`;
// En GuardTable: const label = `${guard.firstName} ${guard.lastName}`;

// ✅ — guard.helper.ts
export class GuardHelper {
  static buildFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`
  }
}

// Uso en cualquier componente
import { GuardHelper } from '../domain/guard.helper'
const fullName = GuardHelper.buildFullName(guard.firstName, guard.lastName)
```

---

## 10. Helpers, objetos y services como clases con SRP

Helpers, objetos utilitarios y services se implementan como **clases** siguiendo el
Principio de Responsabilidad Única (SRP de SOLID). Una clase = una responsabilidad.

```tsx
// ❌ — función suelta mezclando responsabilidades
function processGuard(guard: Guard) {
  const name = `${guard.firstName} ${guard.lastName}`
  fetch(`/api/guards/${guard.id}`, { method: 'PUT', body: JSON.stringify({ name }) })
}

// ✅ — clases con responsabilidad única
// guard.helper.ts — solo transformaciones de datos
export class GuardHelper {
  static buildFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`
  }
}

// guard.service.ts — solo comunicación con la API
export class GuardService {
  static async update(guardId: string, payload: Partial<Guard>): Promise<Guard> {
    const response = await fetch(`/api/guards/${guardId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return response.json()
  }
}
```

---

## Checklist antes de hacer commit

- [ ] No hay comentarios que expliquen código evidente.
- [ ] Más de 2 estados relacionados usan `useReducer`.
- [ ] Un solo componente exportado por archivo.
- [ ] Los `.map()` en JSX no contienen variables internas.
- [ ] Todos los identificadores tienen nombres descriptivos (sin letras sueltas).
- [ ] Solo la interfaz `Props` está en el archivo del componente; el resto en `*.model.ts`.
- [ ] Las clases CSS dinámicas están en `useMemo`, no como ternarios en el JSX.
- [ ] La lógica compleja está en un custom hook o service.
- [ ] No hay código duplicado; la lógica reutilizable está en helpers.
- [ ] Helpers y services son clases con responsabilidad única (SRP).
