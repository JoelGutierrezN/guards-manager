import { type JSX } from 'react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ComboboxOption } from './combobox-option.component'
import { Skeleton } from './skeleton.component'
import type { ComboboxItem, ComboboxSearchStatus } from './combobox.model'

interface Props {
  listId: string
  optionIdPrefix: string
  status: ComboboxSearchStatus
  items: ComboboxItem[]
  errorMessage: string | null
  emptyMessage: string
  query: string
  selectedValue: string | null
  highlightedIndex: number
  createLabel?: string
  onCreate?: (query: string) => void
  onSelect: (value: string) => void
  onHighlight: (index: number) => void
  onRetry: () => void
}

const SKELETON_ROW_KEYS = ['first', 'second', 'third']

export function ComboboxPanel({
  listId,
  optionIdPrefix,
  status,
  items,
  errorMessage,
  emptyMessage,
  query,
  selectedValue,
  highlightedIndex,
  createLabel,
  onCreate,
  onSelect,
  onHighlight,
  onRetry,
}: Props): JSX.Element {
  const trimmedQuery = query.trim()
  const hasExactMatch = items.some(
    (item) => item.label.trim().toLowerCase() === trimmedQuery.toLowerCase(),
  )
  const isCreateVisible = Boolean(onCreate) && trimmedQuery !== '' && !hasExactMatch

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[6] max-h-[280px] overflow-auto rounded-[18px] border border-hairline bg-white p-1.5 shadow-[0_12px_36px_-8px_rgba(14,15,60,0.18)]">
      {status === 'loading' && (
        <div className="flex flex-col gap-2 px-2.5 py-3">
          {SKELETON_ROW_KEYS.map((rowKey) => (
            <Skeleton key={rowKey} shape="text" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="px-2.5 py-4 text-center">
          <p className="mb-2 text-[13px] text-danger">{errorMessage}</p>
          <button
            type="button"
            className="cursor-pointer text-[12px] font-semibold text-brand underline underline-offset-2"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onRetry}
          >
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && items.length === 0 && !isCreateVisible && (
        <p className="px-2.5 py-4 text-center text-[13px] text-muted">{emptyMessage}</p>
      )}

      {status === 'ready' && items.length > 0 && (
        <div role="listbox" id={listId} className="flex flex-col gap-0.5">
          {items.map((item, index) => (
            <ComboboxOption
              key={item.value}
              item={item}
              optionId={`${optionIdPrefix}-${index}`}
              isSelected={item.value === selectedValue}
              isHighlighted={index === highlightedIndex}
              onSelect={onSelect}
              onHighlight={() => onHighlight(index)}
            />
          ))}
        </div>
      )}

      {isCreateVisible && onCreate && (
        <div className={items.length > 0 ? 'mt-1 border-t border-hairline pt-1' : ''}>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[13px] font-semibold text-brand transition-colors hover:bg-brand-soft"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onCreate(trimmedQuery)}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={1.8} />
            <span className="truncate">
              {createLabel ?? 'Crear'} «{trimmedQuery}»
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
