import { type JSX, useCallback } from 'react'
import { File01Icon } from '@hugeicons/core-free-icons'
import { Empty, useToasts } from '../../../shared/infraestructure/components/ui'
import type { EmployeeFileDocument } from '../../domain/employee-file-document.model'
import { EmployeeFileDocumentDownloadService } from '../services/employee-file-document-download.service'
import { EmployeeFileDocumentCard } from './employee-file-document-card.component'

interface Props {
  documents: EmployeeFileDocument[]
}

const EMPTY_TITLE = 'Sin documentos'
const EMPTY_BODY =
  'Los documentos aparecerán aquí cuando el resguardo o la devolución tengan una hoja firmada.'

export function EmployeeFileDocumentsGrid({ documents }: Props): JSX.Element {
  const [addToast, ToastHost] = useToasts()

  const handleDownload = useCallback(
    async (document: EmployeeFileDocument) => {
      const { succeeded, message } = await EmployeeFileDocumentDownloadService.download(document)
      addToast(message, succeeded ? 'success' : 'error')
    },
    [addToast],
  )

  if (documents.length === 0) {
    return <Empty icon={File01Icon} title={EMPTY_TITLE} body={EMPTY_BODY} />
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
        {documents.map((document) => (
          <EmployeeFileDocumentCard
            key={document.id}
            document={document}
            onDownload={(selected) => void handleDownload(selected)}
          />
        ))}
      </div>
      {ToastHost}
    </div>
  )
}
