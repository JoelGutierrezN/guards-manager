import { type JSX } from 'react'
import { Tick01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  optionValue: string
  label: string
  isSelected: boolean
  onSelect: (value: string) => void
}

export function ComboboxOption({ optionValue, label, isSelected, onSelect }: Props): JSX.Element {
  const buttonClassName = cn(
    'flex w-full cursor-pointer items-center justify-between rounded-[8px] px-2.5 py-2 text-left text-[13px] font-medium transition-colors',
    isSelected ? 'bg-brand-soft text-brand font-semibold' : 'text-ink-2 hover:bg-paper-tint',
  )

  return (
    <button type="button" className={buttonClassName} onClick={() => onSelect(optionValue)}>
      <span>{label}</span>
      {isSelected && <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={1.8} />}
    </button>
  )
}
