import { type JSX, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { BrandSelectOption } from '../../../brands/domain/brand-select.model'
import { SearchInput } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  brands: BrandSelectOption[]
  onSelect: (brandId: string) => void
}

export function BrandTabPicker({ brands, onSelect }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [open])

  const filteredBrands = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    return normalized === ''
      ? brands
      : brands.filter((brand) => brand.name.toLowerCase().includes(normalized))
  }, [brands, search])

  const triggerClassName = useMemo(
    () =>
      cn(
        '-mb-px inline-flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2 text-[12px] font-medium transition-[color,border-color]',
        open ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink-2',
      ),
    [open],
  )

  const selectBrand = (brandId: string): void => {
    onSelect(brandId)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} className="relative">
      <button type="button" className={triggerClassName} onClick={() => setOpen((value) => !value)}>
        <span>Otra</span>
        <span className="rounded-full bg-cream-2 px-1.5 py-px text-[10px] font-semibold tabular-nums text-ink-3">
          {brands.length}
        </span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={1.8} />
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-64 rounded-[14px] border border-hairline bg-white p-2 shadow-[0_8px_24px_rgba(14,15,60,0.12)]">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar marca…"
            ariaLabel="Buscar marca"
            className="h-8 max-w-full"
          />
          <ul className="mt-2 max-h-56 overflow-y-auto">
            {filteredBrands.map((brand) => (
              <li key={brand.id}>
                <button
                  type="button"
                  onClick={() => selectBrand(brand.id)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] text-ink transition-colors hover:bg-cream"
                >
                  <span>{brand.name}</span>
                  <span className="font-mono text-[11px] text-muted">{brand.modelsCount}</span>
                </button>
              </li>
            ))}
            {filteredBrands.length === 0 && (
              <li className="px-2.5 py-3 text-center text-[12px] text-muted">Sin resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
