import { type JSX } from 'react'
import { Skeleton } from '../../../shared/infraestructure/components/ui'

export function CustodyDetailSkeleton(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[1480px]" aria-busy="true">
      <Skeleton width="140px" height="16px" />
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton width="220px" height="34px" />
        <Skeleton width="420px" height="14px" />
      </div>
      <div className="mt-6 grid grid-cols-[300px_1fr] gap-4 max-[1100px]:grid-cols-1">
        <Skeleton shape="block" height="200px" />
        <Skeleton shape="block" height="320px" />
      </div>
    </div>
  )
}
