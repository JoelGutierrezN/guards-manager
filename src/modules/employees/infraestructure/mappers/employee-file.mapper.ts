import type { Employee } from '../../domain/employee.entity'
import type { EmployeeFile, EmployeeFileProfile } from '../../domain/employee-file.entity'
import type { EmployeeFileEvent } from '../../domain/employee-file-event.model'
import type { EmployeeFileItem } from '../../domain/employee-file-item.model'
import type { EmployeeFileSummary } from '../../domain/employee-file-summary.model'
import type {
  EmployeeFileDto,
  EmployeeFileEventDto,
  EmployeeFileItemDto,
  EmployeeFileProfileDto,
  EmployeeFileSummaryDto,
} from '../dto/employee-file.dto'

const NO_ALERTS = 0

export class EmployeeFileMapper {
  static toEmployeeFile(dto: EmployeeFileDto): EmployeeFile {
    return {
      employee: EmployeeFileMapper.toProfile(dto.employee),
      summary: EmployeeFileMapper.toSummary(dto.summary),
      activeItems: dto.activeItems.map((item) => EmployeeFileMapper.toItem(item)),
      history: dto.history.map((event) => EmployeeFileMapper.toEvent(event)),
    }
  }

  /** `EmployeeFormModal` tipa su prop como `Employee`, así que el expediente se completa
   *  con los contadores del resumen para poder reutilizar el modal de edición. */
  static toEmployee(file: EmployeeFile): Employee {
    const { employee, summary } = file
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
      // TODO API: el expediente todavía no expone alertas
      alertsCount: NO_ALERTS,
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
    }
  }

  private static toSummary(dto: EmployeeFileSummaryDto): EmployeeFileSummary {
    return {
      activeItems: dto.activeItems,
      historicalItems: dto.historicalItems,
      returnedItems: dto.returnedItems,
      damagedItems: dto.damagedItems ?? null,
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
      title: dto.title,
      body: dto.body,
      date: dto.date,
      time: dto.time,
      occurredAt: dto.occurredAt,
    }
  }
}
