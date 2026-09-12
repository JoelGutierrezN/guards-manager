import { type JSX } from 'react'
import { Download01Icon } from '@hugeicons/core-free-icons'
import { Button, FileDropzone } from '../../../../shared/infraestructure/components/ui'

const ACCEPTED_EXTENSIONS = '.xlsx,.xls,.csv'
const DROPZONE_HINT = 'Formatos aceptados: .xlsx, .xls, .csv (máx. 20 MB)'

interface Props {
  selectedFileName: string | null
  isDownloadingTemplate: boolean
  isUploading: boolean
  uploadError: string | null
  onDownloadTemplate: () => void
  onFileSelected: (file: File) => void
  onClearFile: () => void
  onUpload: () => void
}

export function ImportUploadPanel({
  selectedFileName,
  isDownloadingTemplate,
  isUploading,
  uploadError,
  onDownloadTemplate,
  onFileSelected,
  onClearFile,
  onUpload,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[16px] border border-hairline bg-cream-2 px-4 py-3">
        <p className="mb-2 text-[12px] text-ink-2">
          Descarga la plantilla, complétala con las columnas nombre, marca y modelo, y súbela aquí
          para dar de alta varios productos a la vez.
        </p>
        <Button
          icon={Download01Icon}
          size="sm"
          disabled={isDownloadingTemplate}
          onClick={onDownloadTemplate}
        >
          {isDownloadingTemplate ? 'Descargando…' : 'Descargar plantilla'}
        </Button>
      </div>

      <FileDropzone
        accept={ACCEPTED_EXTENSIONS}
        hint={DROPZONE_HINT}
        selectedFileName={selectedFileName}
        disabled={isUploading}
        onFileSelected={onFileSelected}
        onClear={onClearFile}
      />

      {uploadError && <p className="text-[12px] font-medium text-danger">{uploadError}</p>}

      <Button
        variant="primary"
        disabled={selectedFileName === null || isUploading}
        onClick={onUpload}
      >
        {isUploading ? 'Subiendo…' : 'Importar archivo'}
      </Button>
    </div>
  )
}
