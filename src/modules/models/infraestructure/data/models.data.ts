/** Modelo de herramienta perteneciente a una marca. */
export interface ToolModel {
  brand: string
  /** Código del modelo (p. ej. "DCD996"). */
  code: string
  desc: string
  /** Herramientas de este modelo en inventario. */
  tools: number
  /** Herramientas asignadas (en resguardo). */
  asg: number
}

/** Marcas disponibles para filtrar y seleccionar al crear un modelo. */
export const BRANDS_FILTER = ['Todas', 'DeWalt', 'Makita', 'Milwaukee', 'Bosch', 'Fluke'] as const

export const MODELS: ToolModel[] = [
  { brand: 'DeWalt', code: 'DCD996', desc: 'Taladro percutor 20V MAX XR', tools: 24, asg: 18 },
  { brand: 'DeWalt', code: 'DCD777', desc: 'Taladro inalámbrico 20V', tools: 12, asg: 9 },
  { brand: 'DeWalt', code: 'DCF887', desc: 'Atornillador impacto 20V', tools: 30, asg: 28 },
  { brand: 'DeWalt', code: 'DWE1622K', desc: 'Taladro de banco', tools: 3, asg: 2 },
  { brand: 'Makita', code: 'XSH06PT', desc: 'Sierra circular 18Vx2', tools: 8, asg: 3 },
  { brand: 'Makita', code: 'GA4570', desc: 'Pulidora 4½', tools: 18, asg: 11 },
  { brand: 'Makita', code: 'BO5041', desc: 'Lijadora orbital', tools: 9, asg: 6 },
  { brand: 'Milwaukee', code: 'M18 FUEL', desc: 'Llave de impacto 1/2"', tools: 12, asg: 12 },
  { brand: 'Milwaukee', code: 'M18 GG', desc: 'Engrasadora 18V', tools: 4, asg: 4 },
  { brand: 'Bosch', code: 'GBH 18V-26', desc: 'Rotomartillo SDS-Plus', tools: 15, asg: 9 },
  { brand: 'Bosch', code: 'GSA 18V-32', desc: 'Sierra reciprocante', tools: 7, asg: 5 },
  { brand: 'Bosch', code: 'GHG 18V-50', desc: 'Soplete de calor', tools: 6, asg: 2 },
  { brand: 'Fluke', code: '117', desc: 'Multímetro digital TRMS', tools: 10, asg: 1 },
]

/** Porcentaje de uso (asignadas sobre inventario), redondeado. */
export const usagePct = (asg: number, tools: number): number =>
  tools > 0 ? Math.round((asg / tools) * 100) : 0
