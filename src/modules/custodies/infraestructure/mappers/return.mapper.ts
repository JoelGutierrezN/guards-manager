import type { CreateReturnInput } from '../../domain/return-input.model'
import type {
  CustodyReturn,
  ReturnEmployee,
  ReturnItem,
  ReturnItemStock,
} from '../../domain/return.entity'
import type { CustodyItemProduct } from '../../domain/custody.entity'
import type { CustodyItemProductDto } from '../dto/custody.dto'
import type {
  ReturnDto,
  ReturnEmployeeDto,
  ReturnItemDto,
  ReturnRequestDto,
} from '../dto/return.dto'
import { CustodyMapper } from './custody.mapper'

const MISSING_LABEL = '—'
const MISSING_PRODUCT_NAME = 'Unidad dada de baja'

export class ReturnMapper {
  static toRequestBody(input: CreateReturnInput): ReturnRequestDto {
    const body: ReturnRequestDto = {
      items: input.items.map((item) => {
        const itemNotes = item.notes?.trim() ?? ''
        return itemNotes === ''
          ? { stock_id: item.stockId, condition: item.condition }
          : { stock_id: item.stockId, condition: item.condition, notes: itemNotes }
      }),
    }
    const notes = input.notes?.trim() ?? ''
    if (notes !== '') body.notes = notes
    return body
  }

  static toEmployee(dto: ReturnEmployeeDto | null): ReturnEmployee | null {
    if (dto == null) return null
    return { id: dto.id, identifier: dto.identifier, name: dto.name }
  }

  static toReturn(dto: ReturnDto): CustodyReturn {
    return {
      id: dto.id,
      code: dto.code,
      custodyId: dto.custodyId,
      custodyCode: dto.custodyCode ?? '',
      employeeId: dto.employeeId ?? dto.employee?.id ?? null,
      employee: ReturnMapper.toEmployee(dto.employee ?? null),
      type: dto.type,
      notes: dto.notes ?? null,
      receivedBy: CustodyMapper.toAuthor(dto.receivedBy ?? null),
      itemsCount: dto.itemsCount,
      items: (dto.items ?? []).map((item) => ReturnMapper.toItem(item)),
      signedAt: dto.signedAt ?? null,
      sheet: CustodyMapper.toSheet(dto.sheet ?? null),
      createdAt: dto.createdAt,
    }
  }

  /**
   * `stock` y `stock.product` llegan en `null` cuando la unidad o el producto fueron dados
   * de baja: se degrada a un marcador de posición en vez de romper la pantalla completa.
   */
  private static toItem(dto: ReturnItemDto): ReturnItem {
    return {
      id: dto.id,
      condition: dto.condition,
      conditionNotes: dto.conditionNotes ?? null,
      stock: ReturnMapper.toItemStock(dto),
    }
  }

  private static toItemStock(dto: ReturnItemDto): ReturnItemStock {
    const { stock } = dto
    if (stock == null) {
      return {
        id: dto.stockId,
        consecutive: MISSING_LABEL,
        condition: dto.condition,
        product: ReturnMapper.toItemProduct(null, ''),
      }
    }

    return {
      id: stock.id,
      consecutive: stock.consecutive,
      condition: stock.condition,
      product: ReturnMapper.toItemProduct(stock.product, stock.productId ?? ''),
    }
  }

  private static toItemProduct(
    dto: CustodyItemProductDto | null,
    fallbackId: string,
  ): CustodyItemProduct {
    if (dto == null) {
      return { id: fallbackId, name: MISSING_PRODUCT_NAME, brand: null, model: null }
    }
    return { id: dto.id, name: dto.name, brand: dto.brand ?? null, model: dto.model ?? null }
  }
}
