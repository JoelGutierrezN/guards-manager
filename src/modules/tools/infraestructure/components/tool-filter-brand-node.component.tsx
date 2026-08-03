import { type JSX, useMemo, useState } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { Checkbox, Icon } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { CatalogBrandNode } from '../../domain/catalog-option.model'
import { ToolFilterCheckItem } from './tool-filter-check-item.component'

interface Props {
  node: CatalogBrandNode
  selectedBrands: string[]
  selectedModels: string[]
  defaultExpanded?: boolean
  forceExpanded?: boolean
  onToggleBrand: (brand: string) => void
  onToggleModel: (model: string) => void
}

export function ToolFilterBrandNode({
  node,
  selectedBrands,
  selectedModels,
  defaultExpanded = false,
  forceExpanded = false,
  onToggleBrand,
  onToggleModel,
}: Props): JSX.Element {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const isExpanded = forceExpanded || expanded

  const chevronClass = useMemo(
    () => cn('inline-flex transition-transform', !isExpanded && '-rotate-90'),
    [isExpanded],
  )

  return (
    <div>
      <div className="flex items-center justify-between py-0.5">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
            onClick={() => setExpanded((previous) => !previous)}
            aria-label={isExpanded ? `Colapsar ${node.brand}` : `Expandir ${node.brand}`}
          >
            <span className={chevronClass}>
              <Icon icon={ArrowDown01Icon} size={13} />
            </span>
          </button>
          <Checkbox
            checked={selectedBrands.includes(node.id)}
            onChange={() => onToggleBrand(node.id)}
            label={node.brand}
          />
        </div>
        <span className="font-mono text-[11px] text-muted">{node.count}</span>
      </div>

      {isExpanded && (
        <div className="ml-2 mt-1 flex flex-col gap-1 border-l border-hairline pl-3">
          {node.models.map((model) => (
            <ToolFilterCheckItem
              key={model.id}
              filterKey={model.id}
              label={model.name}
              count={model.count}
              checked={selectedModels.includes(model.id)}
              onToggle={onToggleModel}
            />
          ))}
        </div>
      )}
    </div>
  )
}
