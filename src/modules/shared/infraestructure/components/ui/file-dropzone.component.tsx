import {
  type ChangeEvent,
  type DragEvent,
  type JSX,
  type MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, CloudUploadIcon, File01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../utils/cn'
import { FileDropzoneHelper } from './file-dropzone.helper'

interface Props {
  accept: string
  hint: string
  selectedFileName: string | null
  disabled?: boolean
  onFileSelected: (file: File) => void
  onClear: () => void
}

export function FileDropzone({
  accept,
  hint,
  selectedFileName,
  disabled = false,
  onFileSelected,
  onClear,
}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const zoneClassName = useMemo(
    () =>
      cn(
        'flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed px-4 py-6 text-center transition-[border-color,background] duration-200',
        disabled && 'pointer-events-none opacity-50',
        isDraggingOver
          ? 'border-brand bg-brand-soft'
          : 'border-hairline-strong bg-transparent hover:border-brand hover:bg-brand-soft',
      ),
    [disabled, isDraggingOver],
  )

  const openFileDialog = useCallback(() => inputRef.current?.click(), [])

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const [file] = Array.from(event.target.files ?? [])
      if (file) onFileSelected(file)
      event.target.value = ''
    },
    [onFileSelected],
  )

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (!disabled) setIsDraggingOver(true)
    },
    [disabled],
  )

  const handleDragLeave = useCallback(() => setIsDraggingOver(false), [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDraggingOver(false)
      if (disabled) return
      const file = FileDropzoneHelper.firstFileFrom(event.dataTransfer)
      if (file && FileDropzoneHelper.extensionMatches(file.name, accept)) onFileSelected(file)
    },
    [accept, disabled, onFileSelected],
  )

  const handleClear = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onClear()
    },
    [onClear],
  )

  if (selectedFileName !== null) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[18px] border border-hairline-strong bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-brand-soft text-brand">
            <HugeiconsIcon icon={File01Icon} size={16} strokeWidth={1.8} />
          </span>
          <span className="truncate text-[13px] font-medium text-ink">{selectedFileName}</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          aria-label="Quitar archivo"
          className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-2 hover:bg-danger-soft hover:text-danger"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.8} />
        </button>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openFileDialog}
      onKeyDown={(event) => event.key === 'Enter' && openFileDialog()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={zoneClassName}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand">
        <HugeiconsIcon icon={CloudUploadIcon} size={20} strokeWidth={1.8} />
      </span>
      <p className="text-[13px] font-medium text-ink">
        Arrastra el archivo o haz clic para elegirlo
      </p>
      <p className="text-[11px] text-muted">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
