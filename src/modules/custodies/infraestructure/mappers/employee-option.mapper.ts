import type { EmployeeOption } from '../../domain/employee-option.model'
import type { EmployeeOptionCollectionDto, EmployeeOptionDto } from '../dto/employee-option.dto'

export class EmployeeOptionMapper {
  static toEmployeeOption(dto: EmployeeOptionDto): EmployeeOption {
    return {
      id: dto.id,
      identifier: dto.identifier,
      name: dto.name,
      roleName: dto.roleName ?? null,
      activeToolsCount: dto.activeToolsCount ?? 0,
    }
  }

  static toEmployeeOptions(dto: EmployeeOptionCollectionDto): EmployeeOption[] {
    return dto.data.map((employee) => EmployeeOptionMapper.toEmployeeOption(employee))
  }
}
