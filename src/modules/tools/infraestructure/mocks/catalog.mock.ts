// TODO API: GET /api/brands (MOCK_BRANDS) · POST /api/brands (crear marca).
// TODO API: GET /api/models?brand={value} (MOCK_MODELS) · POST /api/models (crear modelo).
import type { BrandOption, ModelOption } from '../../domain/catalog-option.model'

export const MOCK_BRANDS: BrandOption[] = [
  { value: 'DeWalt', label: 'DeWalt', models: 4 },
  { value: 'Makita', label: 'Makita', models: 3 },
  { value: 'Milwaukee', label: 'Milwaukee', models: 2 },
  { value: 'Bosch', label: 'Bosch', models: 4 },
  { value: 'Fluke', label: 'Fluke', models: 1 },
]

export const MOCK_MODELS: Record<string, ModelOption[]> = {
  DeWalt: [
    { value: 'DCD996', label: 'DCD996 · Taladro percutor 20V' },
    { value: 'DCD777', label: 'DCD777 · Taladro inalámbrico' },
    { value: 'DCF887', label: 'DCF887 · Atornillador impacto' },
    { value: 'DWE1622K', label: 'DWE1622K · Taladro de banco' },
  ],
  Makita: [
    { value: 'XSH06PT', label: 'XSH06PT · Sierra circular 18Vx2' },
    { value: 'GA4570', label: 'GA4570 · Pulidora 4½' },
    { value: 'BO5041', label: 'BO5041 · Lijadora orbital' },
  ],
  Milwaukee: [
    { value: 'M18 FUEL', label: 'M18 FUEL · Llave de impacto' },
    { value: 'M18 GG', label: 'M18 GG · Engrasadora' },
  ],
  Bosch: [
    { value: 'GBH 18V-26', label: 'GBH 18V-26 · Rotomartillo' },
    { value: 'GSA 18V-32', label: 'GSA 18V-32 · Sierra reciprocante' },
    { value: 'GHG 18V-50', label: 'GHG 18V-50 · Soplete de calor' },
  ],
  Fluke: [{ value: '117', label: '117 · Multímetro digital' }],
}

