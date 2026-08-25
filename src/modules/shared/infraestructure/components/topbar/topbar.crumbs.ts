export type Crumb = string | string[]

export const TOPBAR_CRUMBS: Record<string, Crumb> = {
  dashboard: 'Panel general',
  stockIn: ['Inventario', 'Ingreso de inventario'],
  newAssignment: ['Operación', 'Nueva asignación'],
  assignments: ['Operación', 'Resguardo'],
  tools: ['Catálogos', 'Herramientas'],
  brands: ['Catálogos', 'Marcas'],
  models: ['Catálogos', 'Modelos'],
  employees: ['Catálogos', 'Personal'],
  personal: ['Catálogos', 'Personal'],
  profile: ['Cuenta', 'Mi perfil'],
  errors: ['Cuenta', 'Estados'],
  assignmentDetail: ['Operación', 'Resguardo', 'AS-0140'],
  returnNew: ['Operación', 'Resguardo', 'AS-0140', 'Devolución'],
  signature: ['Operación', 'Resguardo', 'Firma'],
  employeeFile: ['Catálogos', 'Personal', 'Expediente'],
  inbox: 'Mi bandeja',
  settings: ['Cuenta', 'Configuración'],
}

export const resolveCrumb = (id: string): string[] => {
  const crumb = TOPBAR_CRUMBS[id]
  if (!crumb) return []
  return Array.isArray(crumb) ? crumb : [crumb]
}
