import { type JSX } from 'react'

export function EmployeeFileSkeleton(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[1480px] animate-pulse">
      <div className="mb-3 h-7 w-[150px] rounded-full bg-cream-2" />

      <div className="mb-4 flex flex-wrap justify-between gap-6 border-b border-hairline py-1 pb-5">
        <div>
          <div className="mb-3 h-3 w-[170px] rounded-full bg-cream-2" />
          <div className="h-10 w-[340px] rounded-[14px] bg-cream-2" />
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="h-4 w-[360px] rounded-full bg-cream-2" />
          <div className="flex gap-2">
            <div className="h-[34px] w-[140px] rounded-full bg-cream-2" />
            <div className="h-[34px] w-[90px] rounded-full bg-cream-2" />
            <div className="h-[34px] w-[160px] rounded-full bg-cream-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-4 max-[1100px]:grid-cols-1">
        <div className="flex flex-col gap-3">
          <div className="h-[270px] rounded-[26px] bg-cream-2" />
          <div className="h-[140px] rounded-[26px] bg-cream-2" />
        </div>
        <div className="h-[430px] rounded-[26px] bg-cream-2" />
      </div>
    </div>
  )
}
