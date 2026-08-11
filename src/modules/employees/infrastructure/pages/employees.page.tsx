import { Button, PageHero } from '../../../shared/infraestructure/components/ui'
import {
  AlertIcon,
  Download01Icon,
  HierarchyFilesIcon,
  PlusSignIcon,
  UserMultipleIcon,
} from '@hugeicons/core-free-icons'
import { KpiCard } from '../../../shared/infraestructure/components/ui/kpi-card.tsx'
import { EmployeesTable } from '../components/employees-table.tsx'

export const EmployeesPage = () => {
  return (
    <div>
      <PageHero
        eyebrow="Personal · Directorio"
        title="Personal operativo"
        italic="operativo"
        lede="142 colaboradores activos. 87 con herramientas en uso, 3 requieren tu atención por devoluciones vencidas."
        actions={
          <div className="reveal d2 mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button icon={Download01Icon} size="md">
                Exportar
              </Button>
              <Button variant="primary" icon={PlusSignIcon} size="md" onClick={() => {}}>
                + Nuevo empleado
              </Button>
            </div>
          </div>
        }
      />

      <div className="w-full flex items-center justify-start gap-2 mb-2">
        <KpiCard title="Activos totales" quantity="162" icon={UserMultipleIcon} />
        <KpiCard
          title="Con asignaciones"
          quantity="87"
          variant="primary"
          leading="61%"
          icon={HierarchyFilesIcon}
        />
        <KpiCard title="Sin asignaciones" quantity="3" leading="vencidos" icon={AlertIcon} />
      </div>

      <EmployeesTable />
    </div>
  )
}
