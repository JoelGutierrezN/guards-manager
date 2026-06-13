// TODO API: reemplazar por GET /api/tools (listado paginado con filtros, búsqueda y orden).
//           Al integrar la API, eliminar este archivo de mocks.
import type { Tool } from '../../domain/tool.entity'

export const MOCK_TOOLS: Tool[] = [
  { id: 1, name: 'Taladro percutor', brand: 'DeWalt', model: 'DCD996', total: 24, available: 6, assigned: 18, status: 'ok' },
  { id: 2, name: 'Llave de impacto', brand: 'Milwaukee', model: 'M18 FUEL', total: 12, available: 0, assigned: 12, status: 'low' },
  { id: 3, name: 'Sierra circular', brand: 'Makita', model: 'XSH06PT', total: 8, available: 5, assigned: 3, status: 'ok' },
  { id: 4, name: 'Rotomartillo', brand: 'Bosch', model: 'GBH 18V-26', total: 15, available: 6, assigned: 9, status: 'ok' },
  { id: 5, name: 'Atornillador impacto', brand: 'DeWalt', model: 'DCF887', total: 30, available: 2, assigned: 28, status: 'warn' },
  { id: 6, name: 'Pulidora 4½"', brand: 'Makita', model: 'GA4570', total: 18, available: 7, assigned: 11, status: 'ok' },
  { id: 7, name: 'Multímetro digital', brand: 'Fluke', model: '117', total: 10, available: 9, assigned: 1, status: 'ok' },
  { id: 8, name: 'Soplete de calor', brand: 'Bosch', model: 'GHG 18V-50', total: 6, available: 4, assigned: 2, status: 'ok' },
  { id: 9, name: 'Lijadora orbital', brand: 'Makita', model: 'BO5041', total: 9, available: 3, assigned: 6, status: 'ok' },
  { id: 10, name: 'Taladro inalámbrico', brand: 'DeWalt', model: 'DCD777', total: 12, available: 3, assigned: 9, status: 'ok' },
  { id: 11, name: 'Engrasadora', brand: 'Milwaukee', model: 'M18 GG', total: 4, available: 0, assigned: 4, status: 'low' },
  { id: 12, name: 'Sierra reciprocante', brand: 'Bosch', model: 'GSA 18V-32', total: 7, available: 2, assigned: 5, status: 'ok' },
]
