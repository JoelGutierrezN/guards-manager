import type { EmployeeOption } from '../../domain/employee-option.model'
import type { EmployeeOptionCollectionDto, EmployeeOptionDto } from '../dto/employee-option.dto'

export class EmployeeOptionMapper {
  static toEmployeeOption(dto: EmployeeOptionDto): EmployeeOption {
    return {
      id: dto.id,
      identifier: dto.identifier,
      name: dto.name,
      roleName: dto.roleName ?? null,
      activeToolsCount: dto.activeToolsCount ?? null,
    }
  }

  /**
   * `GET /employees/{id}` no calcula el conteo de herramientas activas (siempre emite 0),
   * así que se descarta en vez de pintar una cifra falsa.
   */
  static toEmployeeOptionWithoutToolsCount(dto: EmployeeOptionDto): EmployeeOption {
    return { ...EmployeeOptionMapper.toEmployeeOption(dto), activeToolsCount: null }
  }

  static toEmployeeOptions(dto: EmployeeOptionCollectionDto): EmployeeOption[] {
    return dto.data.map((employee) => EmployeeOptionMapper.toEmployeeOption(employee))
  }
}
