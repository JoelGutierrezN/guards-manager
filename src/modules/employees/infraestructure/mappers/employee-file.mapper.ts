import type { Employee } from '../../domain/employee.entity'
import type { EmployeeFile, EmployeeFileProfile } from '../../domain/employee-file.entity'
import type { EmployeeFileAlert } from '../../domain/employee-file-alert.model'
import type {
  EmployeeFileDamage,
  EmployeeFileDamageStock,
} from '../../domain/employee-file-damage.model'
import type { EmployeeFileDocument } from '../../domain/employee-file-document.model'
import type { EmployeeFileEvent } from '../../domain/employee-file-event.model'
import type { EmployeeFileItem } from '../../domain/employee-file-item.model'
import type { EmployeeFileSummary } from '../../domain/employee-file-summary.model'
import type {
  EmployeeFileAlertDto,
  EmployeeFileDamageDto,
  EmployeeFileDamageStockDto,
  EmployeeFileDocumentDto,
  EmployeeFileDto,
  EmployeeFileEventDto,
  EmployeeFileItemDto,
  EmployeeFileProfileDto,
  EmployeeFileSummaryDto,
} from '../dto/employee-file.dto'

export class EmployeeFileMapper {
  static toEmployeeFile(dto: EmployeeFileDto): EmployeeFile {
    return {
      employee: EmployeeFileMapper.toProfile(dto.employee),
      summary: EmployeeFileMapper.toSummary(dto.summary),
      activeItems: dto.activeItems.map((item) => EmployeeFileMapper.toItem(item)),
      history: dto.history.map((event) => EmployeeFileMapper.toEvent(event)),
      documents: dto.documents.map((document) => EmployeeFileMapper.toDocument(document)),
      damages: dto.damages.map((damage) => EmployeeFileMapper.toDamage(damage)),
      alerts: dto.alerts.map((alert) => EmployeeFileMapper.toAlert(alert)),
      alertsCount: dto.alertsCount,
    }
  }

  /** `EmployeeFormModal` tipa su prop como `Employee`, así que el expediente se completa
   *  con los contadores del resumen para poder reutilizar el modal de edición. */
  static toEmployee(file: EmployeeFile): Employee {
    const { employee, summary, alertsCount } = file
    return {
      id: employee.id,
      identifier: employee.identifier,
      name: employee.name,
      roleId: employee.roleId,
      roleName: employee.roleName,
      email: employee.email,
      phone: employee.phone,
      status: employee.status,
      activeToolsCount: summary.activeItems,
      historicalToolsCount: summary.historicalItems,
      hireDate: employee.hireDate,
      hiredAt: employee.hiredAt,
      alertsCount,
    }
  }

  private static toProfile(dto: EmployeeFileProfileDto): EmployeeFileProfile {
    return {
      id: dto.id,
      identifier: dto.identifier,
      name: dto.name,
      roleId: dto.roleId,
      roleName: dto.roleName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      status: dto.status,
      hireDate: dto.hireDate,
      hiredAt: dto.hiredAt ?? null,
    }
  }

  private static toSummary(dto: EmployeeFileSummaryDto): EmployeeFileSummary {
    return {
      activeItems: dto.activeItems,
      historicalItems: dto.historicalItems,
      returnedItems: dto.returnedItems,
      damagedItems: dto.damagedItems,
      documents: dto.documents,
    }
  }

  private static toAlert(dto: EmployeeFileAlertDto): EmployeeFileAlert {
    return { type: dto.type, message: dto.message, date: dto.date }
  }

  private static toDamage(dto: EmployeeFileDamageDto): EmployeeFileDamage {
    return {
      id: dto.id,
      returnId: dto.returnId,
      returnCode: dto.returnCode,
      date: dto.date,
      condition: dto.condition,
      notes: dto.notes,
      stock: EmployeeFileMapper.toDamageStock(dto.stock),
      sheetUrl: dto.sheetUrl,
    }
  }

  private static toDamageStock(dto: EmployeeFileDamageStockDto): EmployeeFileDamageStock {
    return {
      id: dto.id,
      consecutive: dto.consecutive,
      productName: dto.productName,
      brandName: dto.brandName ?? null,
      modelName: dto.modelName ?? null,
    }
  }

  private static toDocument(dto: EmployeeFileDocumentDto): EmployeeFileDocument {
    return {
      id: dto.id,
      type: dto.type,
      code: dto.code,
      title: dto.title,
      sizeBytes: dto.sizeBytes,
      createdAt: dto.createdAt,
      url: dto.url,
    }
  }

  private static toItem(dto: EmployeeFileItemDto): EmployeeFileItem {
    return {
      id: dto.id,
      custodyId: dto.custodyId,
      custodyCode: dto.custodyCode,
      stockId: dto.stockId,
      stockConsecutive: dto.stockConsecutive,
      productName: dto.productName,
      brandName: dto.brandName ?? null,
      modelName: dto.modelName ?? null,
      condition: dto.condition,
      assignedAt: dto.assignedAt,
    }
  }

  private static toEvent(dto: EmployeeFileEventDto): EmployeeFileEvent {
    return {
      id: dto.id,
      type: dto.type,
      tone: dto.tone,
      title: dto.title,
      body: dto.body,
      date: dto.date,
      time: dto.time,
      occurredAt: dto.occurredAt,
    }
  }
}
