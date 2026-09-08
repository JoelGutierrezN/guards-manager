import type { CustodyDetail } from './custody.entity'

/** Datos del `loader` de la ruta: alimentan la miga con el folio y la primera pintura del detalle. */
export interface CustodyDetailLoaderData {
  custody: CustodyDetail | null
  error: string | null
}
