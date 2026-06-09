import { type JSX, useMemo, useState } from 'react'
import { ArrowDown01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { ComboboxOption } from './combobox-option.component'

interface ComboboxItem {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: ComboboxItem[]
  onCreateLabel?: string
  onCreate?: ((query: string) => void) | null
  leadIcon?: IconSvgElement
}

export function Combobox({
  value,
  onChange,
  placeholder,
  options,
  onCreateLabel,
  onCreate,
  leadIcon,
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredOptions = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    if (!searchTerm) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm) ||
        option.value.toLowerCase().includes(searchTerm),
    )
  }, [query, options])

  const hasExactMatch = filteredOptions.some(
    (option) => option.value.toLowerCase() === query.trim().toLowerCase(),
  )

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
    setQuery('')
  }

  const handleCreate = () => {
    if (onCreate) {
      onCreate(query.trim())
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleFocus = () => {
    setQuery(value || '')
    setIsOpen(true)
  }

  return (
    <div className="relative">
      <div
        className="flex h-[40px] cursor-text items-center gap-2 rounded-full border border-hairline-strong bg-white px-4 transition-[border-color,box-shadow] hover:border-ink-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]"
        onClick={() => setIsOpen(true)}
      >
        {leadIcon && (
          <span className="inline-flex shrink-0 text-muted">
            <HugeiconsIcon icon={leadIcon} size={14} strokeWidth={1.8} />
          </span>
        )}
        <input
          className="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-[13px] text-ink outline-none placeholder:text-muted-soft"
          placeholder={placeholder}
          value={isOpen ? query : value || ''}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={handleFocus}
          readOnly={!isOpen}
        />
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={1.8} className="shrink-0 text-muted" />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[4]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[6] max-h-[280px] overflow-auto rounded-[16px] border border-hairline bg-white p-1 shadow-[0_12px_36px_-8px_rgba(14,15,60,0.18)]">
            {filteredOptions.length === 0 && !query && (
              <div className="py-4 text-center text-[13px] text-muted">Sin opciones</div>
            )}
            {filteredOptions.map((option) => (
              <ComboboxOption
                key={option.value}
                optionValue={option.value}
                label={option.label}
                isSelected={option.value === value}
                onSelect={handleSelect}
              />
            ))}
            {query.trim() && !hasExactMatch && onCreate && (
              <div
                className={filteredOptions.length > 0 ? 'mt-1 border-t border-hairline pt-1' : ''}
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13px] font-semibold text-brand transition-colors hover:bg-brand-soft"
                  onClick={handleCreate}
                >
                  <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={1.8} />
                  <span>
                    {onCreateLabel || 'Crear'} &ldquo;{query.trim()}&rdquo;
                  </span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
