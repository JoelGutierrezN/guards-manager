/** Producto elegible para un ingreso de inventario. Los conteos faltan cuando vienen de `GET /products/{id}`. */
export interface ProductOption {
  id: string
  name: string
  brandName: string | null
  modelName: string | null
  total: number | null
  available: number | null
}
