import type { ChipTone } from '../../../shared/infraestructure/components/ui'

/** Resumen de marca para la cuadrícula de catálogo. */
export interface Brand {
  name: string
  /** Inicial mostrada en el logotipo de color. */
  initial: string
  /** Color de marca (hex) para el logotipo. */
  color: string
  models: number
  tools: number
  /** Herramientas asignadas (en resguardo). */
  asg: number
}

/** Modelo perteneciente a una marca. */
export interface BrandModel {
  code: string
  desc: string
  tools: number
  asg: number
}

/** Movimiento reciente del catálogo de una marca. */
export interface BrandMove {
  ts: string
  title: string
  body: string
  tone: ChipTone
}

/** Ficha completa de una marca para la pantalla de detalle. */
export interface BrandDetail extends Brand {
  country: string
  since: string
  rows: BrandModel[]
  moves: BrandMove[]
}

export const BRANDS: Brand[] = [
  { name: 'DeWalt', models: 4, tools: 86, asg: 73, color: '#FCBA00', initial: 'D' },
  { name: 'Makita', models: 3, tools: 32, asg: 22, color: '#0E7C3A', initial: 'M' },
  { name: 'Milwaukee', models: 2, tools: 18, asg: 16, color: '#D7202C', initial: 'M' },
  { name: 'Bosch', models: 4, tools: 41, asg: 28, color: '#0073B5', initial: 'B' },
  { name: 'Fluke', models: 1, tools: 10, asg: 1, color: '#FCD600', initial: 'F' },
]

/** Catálogo de detalle por marca (espejo de `BRANDS`). */
export const BRAND_DB: Record<string, BrandDetail> = {
  DeWalt: {
    name: 'DeWalt',
    initial: 'D',
    color: '#FCBA00',
    country: 'EE. UU.',
    models: 4,
    tools: 86,
    asg: 73,
    since: 'MAR·2023',
    rows: [
      { code: 'DCD996', desc: 'Taladro percutor 20V MAX XR', tools: 24, asg: 18 },
      { code: 'DCF887', desc: 'Atornillador impacto 20V', tools: 30, asg: 28 },
      { code: 'DCD777', desc: 'Taladro inalámbrico 20V', tools: 29, asg: 25 },
      { code: 'DWE1622K', desc: 'Taladro de banco', tools: 3, asg: 2 },
    ],
    moves: [
      {
        ts: '29·MAY · 09:12',
        title: 'Asignación AS-0181',
        body: 'DCF887 · Jorge Treviño',
        tone: 'navy',
      },
      {
        ts: '27·MAY · 14:40',
        title: 'Alta de modelo',
        body: 'DWE1622K agregado al catálogo',
        tone: 'ok',
      },
      {
        ts: '21·MAY · 11:03',
        title: 'Devolución DV-0140',
        body: '2× DCD996 · buen estado',
        tone: 'default',
      },
    ],
  },
  Makita: {
    name: 'Makita',
    initial: 'M',
    color: '#0E7C3A',
    country: 'Japón',
    models: 3,
    tools: 32,
    asg: 22,
    since: 'MAY·2023',
    rows: [
      { code: 'GA4570', desc: 'Pulidora 4½', tools: 18, asg: 11 },
      { code: 'BO5041', desc: 'Lijadora orbital', tools: 9, asg: 6 },
      { code: 'XSH06PT', desc: 'Sierra circular 18Vx2', tools: 5, asg: 5 },
    ],
    moves: [
      {
        ts: '28·MAY · 16:20',
        title: 'Asignación AS-0179',
        body: 'GA4570 · Luis Cárdenas',
        tone: 'navy',
      },
      {
        ts: '19·MAY · 10:15',
        title: 'Devolución DV-0136',
        body: '1× BO5041 · revisión menor',
        tone: 'warn',
      },
    ],
  },
  Milwaukee: {
    name: 'Milwaukee',
    initial: 'M',
    color: '#D7202C',
    country: 'EE. UU.',
    models: 2,
    tools: 18,
    asg: 16,
    since: 'JUN·2023',
    rows: [
      { code: 'M18 FUEL', desc: 'Llave de impacto 1/2"', tools: 12, asg: 12 },
      { code: 'M18 GG', desc: 'Engrasadora 18V', tools: 6, asg: 4 },
    ],
    moves: [
      {
        ts: '30·MAY · 08:05',
        title: 'Asignación AS-0184',
        body: 'M18 FUEL · Cuadrilla turno A',
        tone: 'navy',
      },
    ],
  },
  Bosch: {
    name: 'Bosch',
    initial: 'B',
    color: '#0073B5',
    country: 'Alemania',
    models: 4,
    tools: 41,
    asg: 28,
    since: 'ABR·2023',
    rows: [
      { code: 'GBH 18V-26', desc: 'Rotomartillo SDS-Plus', tools: 15, asg: 9 },
      { code: 'GSA 18V-32', desc: 'Sierra reciprocante', tools: 7, asg: 5 },
      { code: 'GHG 18V-50', desc: 'Soplete de calor', tools: 6, asg: 2 },
      { code: 'GWS 18V-10', desc: 'Amoladora angular', tools: 13, asg: 12 },
    ],
    moves: [
      {
        ts: '26·MAY · 13:30',
        title: 'Devolución DV-0139',
        body: 'GBH 18V-26 · buen estado',
        tone: 'default',
      },
      { ts: '12·MAY · 09:48', title: 'Alta de modelo', body: 'GWS 18V-10 agregado', tone: 'ok' },
    ],
  },
  Fluke: {
    name: 'Fluke',
    initial: 'F',
    color: '#FCD600',
    country: 'EE. UU.',
    models: 1,
    tools: 10,
    asg: 1,
    since: 'AGO·2023',
    rows: [{ code: '117', desc: 'Multímetro digital TRMS', tools: 10, asg: 1 }],
    moves: [
      {
        ts: '08·MAY · 15:11',
        title: 'Asignación AS-0162',
        body: 'Fluke 117 · Laboratorio',
        tone: 'navy',
      },
    ],
  },
}

export const usagePct = (asg: number, tools: number): number =>
  tools > 0 ? Math.round((asg / tools) * 100) : 0
