import { type JSX } from 'react'
import { Skeleton } from '../../../../shared/infraestructure/components/ui'

export function ReturnSkeleton(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-300" aria-busy="true">
      <Skeleton width="160px" height="16px" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton width="320px" height="34px" />
        <Skeleton width="460px" height="14px" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <Skeleton shape="block" height="320px" />
        <Skeleton shape="block" height="220px" />
      </div>
    </div>
  )
}
