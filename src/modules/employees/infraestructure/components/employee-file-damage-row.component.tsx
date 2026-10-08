import { type JSX } from 'react'
import { Download01Icon } from '@hugeicons/core-free-icons'
import { Button, Chip } from '../../../shared/infraestructure/components/ui'
import { ItemConditionHelper } from '../../../shared/domain/item-condition.helper'
import { CustodyDateHelper } from '../../../custodies/application/custody-date.helper'
import type { EmployeeFileDamage } from '../../domain/employee-file-damage.model'
import { EmployeeFileDamageHelper } from '../helpers/employee-file-damage.helper'

interface Props {
  damage: EmployeeFileDamage
  onDownloadSheet: (damage: EmployeeFileDamage) => void
}

const NO_SHEET_TIP = 'Esta devolución todavía no tiene una hoja firmada'

export function EmployeeFileDamageRow({ damage, onDownloadSheet }: Props): JSX.Element {
  const hasSheet = EmployeeFileDamageHelper.hasSheet(damage)

  return (
    <tr className="transition-colors [&_td]:hover:bg-paper-tint">
      <td className="border-b border-hairline px-3 py-2.5 align-middle font-mono text-[11px] text-muted">
        {CustodyDateHelper.date(damage.date)}
      </td>
      <td className="border-b border-hairline px-3 py-2.5 align-middle font-mono text-[11px] text-ink-2">
        {damage.returnCode}
      </td>
      <td className="border-b border-hairline px-3 py-2.5 align-middle text-[12px] text-ink">
        {EmployeeFileDamageHelper.toolLabel(damage)}
      </td>
      <td className="border-b border-hairline px-3 py-2.5 align-middle">
        <Chip tone={ItemConditionHelper.tone(damage.condition)} size="sm">
          {ItemConditionHelper.label(damage.condition)}
        </Chip>
      </td>
      <td className="border-b border-hairline px-3 py-2.5 align-middle text-[12px] text-muted">
        {EmployeeFileDamageHelper.notesLabel(damage)}
      </td>
      <td className="border-b border-hairline px-3 py-2.5 align-middle text-right">
        <Button
          icon={Download01Icon}
          size="sm"
          disabled={!hasSheet}
          tip={hasSheet ? undefined : NO_SHEET_TIP}
          onClick={() => onDownloadSheet(damage)}
        >
          Hoja
        </Button>
      </td>
    </tr>
  )
}
