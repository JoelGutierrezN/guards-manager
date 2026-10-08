import type { QueryParams, QueryParamValue } from '../../shared/hooks/query-params.model'
import {
  DEFAULT_EMPLOYEE_FILE_TAB,
  EMPLOYEE_FILE_TABS,
  type EmployeeFileTab,
} from '../domain/employee-file-tab.model'

const TAB_PARAM = 'tab'

/** Único adaptador entre `?tab=` y la pestaña activa del expediente (patrón de
 *  `employee-query-params.helper.ts`): la pestaña por defecto no ensucia la URL. */
export class EmployeeFileTabParamsHelper {
  static tabFrom(params: QueryParams): EmployeeFileTab {
    return EmployeeFileTabParamsHelper.parse(params[TAB_PARAM])
  }

  static toParams(tab: EmployeeFileTab): QueryParams {
    return { [TAB_PARAM]: tab === DEFAULT_EMPLOYEE_FILE_TAB ? undefined : tab }
  }

  private static parse(value: QueryParamValue): EmployeeFileTab {
    const descriptor = EMPLOYEE_FILE_TABS.find(({ value: tab }) => tab === value)
    return descriptor === undefined ? DEFAULT_EMPLOYEE_FILE_TAB : descriptor.value
  }
}
