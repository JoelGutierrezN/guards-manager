import { type JSX, type KeyboardEvent, useId, useMemo, useReducer, useRef } from 'react'
import { ArrowDown01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import { ComboboxPanel } from './combobox-panel.component'
import { COMBOBOX_UI_INITIAL_STATE, comboboxUiReducer } from './combobox.reducer'
import { useComboboxSearch } from './use-combobox-search.hook'
import type { ComboboxItem, ComboboxOptionsLoader } from './combobox.model'

interface Props {
  value: string | null
  onChange: (item: ComboboxItem | null) => void
  loadOptions: ComboboxOptionsLoader
  selectedLabel?: string | null
  placeholder?: string
  emptyMessage?: string
  createLabel?: string
  onCreate?: (query: string) => void
  leadIcon?: IconSvgElement
  id?: string
  ariaLabel?: string
  disabled?: boolean
  error?: boolean
  isClearable?: boolean
  className?: string
}

export function Combobox({
  value,
  onChange,
  loadOptions,
  selectedLabel,
  placeholder = 'Buscar…',
  emptyMessage = 'Sin resultados',
  createLabel,
  onCreate,
  leadIcon,
  id,
  ariaLabel,
  disabled = false,
  error = false,
  isClearable = true,
  className,
}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const listId = `${generatedId}-listbox`
  const optionIdPrefix = `${generatedId}-option`

  const [uiState, dispatchUi] = useReducer(comboboxUiReducer, COMBOBOX_UI_INITIAL_STATE)
  const { status, items, errorMessage, retry } = useComboboxSearch(
    loadOptions,
    uiState.query,
    uiState.isOpen && !disabled,
  )

  const wrapClassName = useMemo(
    () =>
      cn(
        'flex h-[44px] cursor-text items-center gap-2 rounded-full border bg-white px-4 transition-[border-color,box-shadow,background]',
        error
          ? 'border-danger focus-within:shadow-[0_0_0_3px_var(--color-danger-soft)]'
          : 'border-hairline-strong hover:border-ink-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]',
        disabled && 'cursor-not-allowed bg-cream hover:border-hairline-strong',
      ),
    [error, disabled],
  )

  const activeDescendantId =
    uiState.isOpen && uiState.highlightedIndex >= 0
      ? `${optionIdPrefix}-${uiState.highlightedIndex}`
      : undefined

  const handleWrapClick = () => {
    if (disabled) return
    inputRef.current?.focus()
    dispatchUi({ type: 'OPENED' })
  }

  const handleSelect = (optionValue: string) => {
    const selectedItem = items.find((item) => item.value === optionValue)
    if (!selectedItem || selectedItem.disabled) return
    onChange(selectedItem)
    dispatchUi({ type: 'CLOSED' })
  }

  const handleCreate = (query: string) => {
    dispatchUi({ type: 'CLOSED' })
    onCreate?.(query)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      dispatchUi({ type: 'CLOSED' })
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!uiState.isOpen) {
        dispatchUi({ type: 'OPENED' })
        return
      }
      dispatchUi({
        type: 'HIGHLIGHT_MOVED',
        payload: { direction: event.key === 'ArrowDown' ? 1 : -1, total: items.length },
      })
      return
    }
    if (event.key === 'Enter' && uiState.isOpen) {
      event.preventDefault()
      const highlightedItem = items[uiState.highlightedIndex]
      if (highlightedItem) handleSelect(highlightedItem.value)
    }
  }

  const isClearVisible = isClearable && !disabled && Boolean(value) && !uiState.isOpen

  return (
    <div className={cn('relative', className)}>
      <div className={wrapClassName} onClick={handleWrapClick}>
        {leadIcon && (
          <span className="inline-flex shrink-0 text-muted">
            <HugeiconsIcon icon={leadIcon} size={14} strokeWidth={1.8} />
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-label={ariaLabel}
          aria-expanded={uiState.isOpen}
          aria-controls={listId}
          aria-activedescendant={activeDescendantId}
          aria-invalid={error || undefined}
          placeholder={placeholder}
          disabled={disabled}
          value={uiState.isOpen ? uiState.query : (selectedLabel ?? '')}
          onChange={(event) => dispatchUi({ type: 'QUERY_CHANGED', payload: event.target.value })}
          onFocus={() => dispatchUi({ type: 'OPENED' })}
          onBlur={() => dispatchUi({ type: 'CLOSED' })}
          onKeyDown={handleKeyDown}
          className="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-[13px] text-ink outline-none placeholder:text-muted-soft disabled:cursor-not-allowed"
        />
        {isClearVisible && (
          <button
            type="button"
            aria-label="Limpiar selección"
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 text-muted transition-colors hover:bg-cream hover:text-ink"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onChange(null)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2} />
          </button>
        )}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          strokeWidth={1.8}
          className="shrink-0 text-muted"
        />
      </div>

      {uiState.isOpen && (
        <ComboboxPanel
          listId={listId}
          optionIdPrefix={optionIdPrefix}
          status={status}
          items={items}
          errorMessage={errorMessage}
          emptyMessage={emptyMessage}
          query={uiState.query}
          selectedValue={value}
          highlightedIndex={uiState.highlightedIndex}
          createLabel={createLabel}
          onCreate={onCreate ? handleCreate : undefined}
          onSelect={handleSelect}
          onHighlight={(index) => dispatchUi({ type: 'HIGHLIGHT_SET', payload: index })}
          onRetry={retry}
        />
      )}
    </div>
  )
}
