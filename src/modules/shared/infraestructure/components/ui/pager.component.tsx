import { type JSX } from 'react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { PagerButton } from './pager-button.component'
import { PagerPagesHelper } from './pager.helper'

interface Props {
  page: number
  total: number
  onChange: (page: number) => void
}

export function Pager({ page, total, onChange }: Props): JSX.Element {
  const pages = PagerPagesHelper.buildPages(page, total)

  return (
    <div className="inline-flex items-center gap-0.5">
      <PagerButton isDisabled={page <= 1} onPress={() => onChange(page - 1)}>
        <HugeiconsIcon icon={ArrowLeft01Icon} size={13} strokeWidth={1.8} />
      </PagerButton>

      {pages.map((pageEntry, entryIndex) =>
        pageEntry === 'ellipsis' ? (
          <PagerButton key={`ellipsis-${entryIndex}`} isDisabled onPress={() => {}}>
            <span className="text-muted-soft">…</span>
          </PagerButton>
        ) : (
          <PagerButton
            key={pageEntry}
            isActive={pageEntry === page}
            onPress={() => onChange(pageEntry)}
          >
            {pageEntry}
          </PagerButton>
        ),
      )}

      <PagerButton isDisabled={page >= total} onPress={() => onChange(page + 1)}>
        <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={1.8} />
      </PagerButton>
    </div>
  )
}
