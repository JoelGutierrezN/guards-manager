import { type JSX } from 'react'

export function EmployeeRowSkeleton(): JSX.Element {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-[26px] w-[26px] rounded-full bg-cream-2" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-40 rounded bg-cream-2" />
            <div className="h-3 w-16 rounded bg-cream-2" />
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <div className="h-5 w-20 rounded-full bg-cream-2" />
      </td>
      <td className="px-3 py-2.5">
        <div className="h-4 w-8 rounded bg-cream-2" />
      </td>
      <td className="px-3 py-2.5">
        <div className="h-4 w-8 rounded bg-cream-2" />
      </td>
      <td className="px-3 py-2.5">
        <div className="h-4 w-20 rounded bg-cream-2" />
      </td>
      <td className="px-3 py-2.5" />
    </tr>
  )
}
