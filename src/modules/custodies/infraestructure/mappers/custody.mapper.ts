import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type {
  Custody,
  CustodyAuthor,
  CustodyDetail,
  CustodyEmployee,
  CustodyItem,
  CustodyReturnSummary,
  CustodySheet,
  CustodySignature,
} from '../../domain/custody.entity'
import type { CustodiesListPage } from '../../domain/custodies-list-page.model'
import type { CustodiesStats } from '../../domain/custodies-stats.entity'
import type { CreateCustodyInput } from '../../domain/custody-input.model'
import type {
  CustodiesStatsDto,
  CustodyAuthorDto,
  CustodyCollectionDto,
  CustodyDetailDto,
  CustodyDto,
  CustodyEmployeeDto,
  CustodyItemDto,
  CustodyRequestDto,
  CustodyReturnSummaryDto,
  CustodySheetDto,
  CustodySignatureDto,
} from '../dto/custody.dto'

export class CustodyMapper {
  static toRequestBody(input: CreateCustodyInput): CustodyRequestDto {
    const body: CustodyRequestDto = {
      employee_id: input.employeeId,
      items: input.items.map((item) => {
        const notes = item.notes?.trim() ?? ''
        return notes === ''
          ? { stock_id: item.stockId, condition: item.condition }
          : { stock_id: item.stockId, condition: item.condition, notes }
      }),
    }
    const notes = input.notes?.trim() ?? ''
    if (notes !== '') body.notes = notes
    return body
  }

  static toEmployee(dto: CustodyEmployeeDto): CustodyEmployee {
    return {
      id: dto.id,
      identifier: dto.identifier,
      name: dto.name,
      roleName: dto.roleName ?? null,
    }
  }

  static toAuthor(dto: CustodyAuthorDto | null): CustodyAuthor | null {
    if (dto == null) return null
    return { id: dto.id, name: dto.name }
  }

  static toSheet(dto: CustodySheetDto | null): CustodySheet | null {
    if (dto == null) return null
    return {
      id: dto.id,
      code: dto.code,
      filename: dto.filename,
      sizeBytes: dto.sizeBytes,
      url: dto.url,
    }
  }

  static toSignature(dto: CustodySignatureDto | null): CustodySignature | null {
    if (dto == null) return null
    return { signedAt: dto.signedAt, signerName: dto.signerName }
  }

  static toItem(dto: CustodyItemDto): CustodyItem {
    return {
      id: dto.id,
      condition: dto.condition,
      notes: dto.notes ?? null,
      isReturned: dto.isReturned,
      returnedAt: dto.returnedAt ?? null,
      stock: {
        id: dto.stock.id,
        consecutive: dto.stock.consecutive,
        condition: dto.stock.condition,
        product: {
          id: dto.stock.product.id,
          name: dto.stock.product.name,
          brand: dto.stock.product.brand ?? null,
          model: dto.stock.product.model ?? null,
        },
      },
    }
  }

  static toReturnSummary(dto: CustodyReturnSummaryDto): CustodyReturnSummary {
    return {
      id: dto.id,
      code: dto.code,
      custodyId: dto.custodyId,
      custodyCode: dto.custodyCode,
      type: dto.type,
      notes: dto.notes ?? null,
      receivedBy: CustodyMapper.toAuthor(dto.receivedBy ?? null),
      itemsCount: dto.itemsCount,
      signedAt: dto.signedAt ?? null,
      sheet: CustodyMapper.toSheet(dto.sheet ?? null),
      createdAt: dto.createdAt,
    }
  }

  static toCustody(dto: CustodyDto): Custody {
    return {
      id: dto.id,
      code: dto.code,
      status: dto.status,
      notes: dto.notes ?? null,
      employee: CustodyMapper.toEmployee(dto.employee),
      createdBy: CustodyMapper.toAuthor(dto.createdBy ?? null),
      itemsCount: dto.itemsCount,
      pendingItemsCount: dto.pendingItemsCount,
      signedAt: dto.signedAt ?? null,
      sheet: CustodyMapper.toSheet(dto.sheet ?? null),
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }
  }

  static toCustodyDetail(dto: CustodyDetailDto): CustodyDetail {
    return {
      ...CustodyMapper.toCustody(dto),
      items: (dto.items ?? []).map((item) => CustodyMapper.toItem(item)),
      returns: (dto.returns ?? []).map((entry) => CustodyMapper.toReturnSummary(entry)),
      signature: CustodyMapper.toSignature(dto.signature ?? null),
    }
  }

  static toStats(dto: CustodiesStatsDto): CustodiesStats {
    return {
      total: dto.total,
      active: dto.active,
      partial: dto.partial,
      returned: dto.returned,
      cancelled: dto.cancelled,
      pendingSignature: dto.pendingSignature,
    }
  }

  static toCustodiesListPage(dto: CustodyCollectionDto): CustodiesListPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      custodies: dto.data.map((custody) => CustodyMapper.toCustody(custody)),
      stats: CustodyMapper.toStats(dto.stats),
    }
  }
}
