import { SignNavigationHelper } from '../../../custodies/infraestructure/helpers/sign-navigation.helper'
import type { DashboardPendingSignature } from '../../domain/dashboard-pending-signature.model'

const NEW_ASSIGNMENT_PATH = '/newAssignment'
const STOCK_IN_PATH = '/stockIn'
const TOOLS_PATH = '/tools'
const EMPLOYEES_PATH = '/personal'
const RETURN_TYPE = 'devolucion'

export class DashboardNavigationHelper {
  static custodiesPath(): string {
    return SignNavigationHelper.custodiesPath()
  }

  static custodyPath(custodyId: string): string {
    return SignNavigationHelper.custodyPath(custodyId)
  }

  static newAssignmentPath(): string {
    return NEW_ASSIGNMENT_PATH
  }

  static stockInPath(): string {
    return STOCK_IN_PATH
  }

  static employeePath(employeeId: string): string {
    return `${EMPLOYEES_PATH}/${employeeId}`
  }

  static productSearchPath(productName: string): string {
    const query = new URLSearchParams({ name: productName })
    return `${TOOLS_PATH}?${query.toString()}`
  }

  static signaturePath({ type, custodyId, id }: DashboardPendingSignature): string {
    if (type === RETURN_TYPE) return SignNavigationHelper.returnSignPath(custodyId, id)
    return SignNavigationHelper.custodySignPath(custodyId)
  }
}
