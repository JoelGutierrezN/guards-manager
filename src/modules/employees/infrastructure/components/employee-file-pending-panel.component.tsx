import { type JSX } from 'react'
import { Chip, Empty } from '../../../shared/infraestructure/components/ui'
import type { EmployeeFilePendingContent } from './employee-file-pending-panel.model'

interface Props {
  content: EmployeeFilePendingContent
}

export function EmployeeFilePendingPanel({ content }: Props): JSX.Element {
  return (
    <Empty
      icon={content.icon}
      title={content.title}
      body={content.body}
      action={
        <Chip tone="warn" size="sm">
          En desarrollo
        </Chip>
      }
    />
  )
}
