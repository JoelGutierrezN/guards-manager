import { Fragment, type JSX } from 'react'

interface Props {
  segment: string
  isLast: boolean
}

export function TopbarBreadcrumbSegment({ segment, isLast }: Props): JSX.Element {
  return (
    <Fragment>
      <span className={isLast ? 'font-semibold text-ink' : undefined}>{segment}</span>
      {!isLast && <span className="text-muted-soft">/</span>}
    </Fragment>
  )
}
