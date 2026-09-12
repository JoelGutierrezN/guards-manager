import { type JSX, useMemo } from 'react'
import { Drawer, Tabs } from '../../../../shared/infraestructure/components/ui'
import type { TabItem } from '../../../../shared/infraestructure/components/ui'
import { useImport } from '../../../hooks/use-import.hook'
import { ImportUploadPanel } from './import-upload-panel.component'
import { ImportBatchPanel } from './import-batch-panel.component'
import { ImportHistoryList } from './import-history-list.component'
import type { ImportTab } from '../../../application/import-state.model'

interface Props {
  open: boolean
  onClose: () => void
  onImported: () => void
}

const TAB_ITEMS: TabItem<ImportTab>[] = [
  { value: 'upload', label: 'Importar' },
  { value: 'history', label: 'Historial' },
]

export function ImportDrawer({ open, onClose, onImported }: Props): JSX.Element {
  const { state, setTab, selectFile, downloadTemplate, upload, resolveEntry, loadHistory } =
    useImport({ open, onImported })

  const shouldShowUploadPanel = useMemo(
    () => state.tab === 'upload' && state.batch === null,
    [state.tab, state.batch],
  )

  return (
    <Drawer open={open} title="Importar productos" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Tabs value={state.tab} items={TAB_ITEMS} onChange={setTab} />

        {state.tab === 'upload' && shouldShowUploadPanel && (
          <ImportUploadPanel
            selectedFileName={state.selectedFile?.name ?? null}
            isDownloadingTemplate={state.isDownloadingTemplate}
            isUploading={state.isUploading}
            uploadError={state.uploadError}
            onDownloadTemplate={() => void downloadTemplate()}
            onFileSelected={selectFile}
            onClearFile={() => selectFile(null)}
            onUpload={() => void upload()}
          />
        )}

        {state.tab === 'upload' && state.batch !== null && (
          <ImportBatchPanel
            batch={state.batch}
            resolvingEntryId={state.resolvingEntryId}
            onResolve={(entryId, action) => void resolveEntry(entryId, action)}
          />
        )}

        {state.tab === 'history' && (
          <ImportHistoryList
            status={state.historyStatus}
            history={state.history}
            onRetry={() => void loadHistory()}
          />
        )}
      </div>
    </Drawer>
  )
}
