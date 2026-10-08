import { type JSX } from 'react'
import { Tabs } from '../../../shared/infraestructure/components/ui'
import type { TabItem } from '../../../shared/infraestructure/components/ui/tabs.model'
import type { EmployeeFile } from '../../domain/employee-file.entity'
import type { EmployeeFileDamage } from '../../domain/employee-file-damage.model'
import type { EmployeeFileDocument } from '../../domain/employee-file-document.model'
import type { EmployeeFileTab } from '../../domain/employee-file-tab.model'
import { EmployeeFileActionsBar } from './employee-file-actions-bar.component'
import { EmployeeFileDamagesTable } from './employee-file-damages-table.component'
import { EmployeeFileDocumentsGrid } from './employee-file-documents-grid.component'
import { EmployeeFileItemsTable } from './employee-file-items-table.component'
import { EmployeeFileTimeline } from './employee-file-timeline.component'

interface Props {
  file: EmployeeFile
  tab: EmployeeFileTab
  tabItems: TabItem<EmployeeFileTab>[]
  selectedItemIds: Set<string>
  selectionCount: number
  allSelected: boolean
  someSelected: boolean
  onTabChange: (tab: EmployeeFileTab) => void
  onToggleItem: (itemId: string) => void
  onToggleAll: () => void
  onClearSelection: () => void
  onDownloadDocument: (document: EmployeeFileDocument) => void
  onDownloadDamageSheet: (damage: EmployeeFileDamage) => void
}

export function EmployeeFilePanel({
  file,
  tab,
  tabItems,
  selectedItemIds,
  selectionCount,
  allSelected,
  someSelected,
  onTabChange,
  onToggleItem,
  onToggleAll,
  onClearSelection,
  onDownloadDocument,
  onDownloadDamageSheet,
}: Props): JSX.Element {
  return (
    <div className="min-w-0 overflow-hidden rounded-[26px] border border-hairline bg-white shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
      <div className="px-4">
        <Tabs value={tab} items={tabItems} onChange={onTabChange} />
      </div>

      {tab === 'active' && (
        <>
          <EmployeeFileActionsBar
            selectionCount={selectionCount}
            totalCount={file.activeItems.length}
            onClearSelection={onClearSelection}
            items={file.activeItems}
            selectedItemIds={selectedItemIds}
          />
          <EmployeeFileItemsTable
            items={file.activeItems}
            selectedItemIds={selectedItemIds}
            allSelected={allSelected}
            someSelected={someSelected}
            onToggleItem={onToggleItem}
            onToggleAll={onToggleAll}
          />
        </>
      )}

      {tab === 'history' && (
        <div className="p-5">
          <EmployeeFileTimeline events={file.history} />
        </div>
      )}

      {tab === 'docs' && (
        <EmployeeFileDocumentsGrid documents={file.documents} onDownload={onDownloadDocument} />
      )}

      {tab === 'damage' && (
        <EmployeeFileDamagesTable damages={file.damages} onDownloadSheet={onDownloadDamageSheet} />
      )}
    </div>
  )
}
