import { type JSX } from 'react'

export function ToolRowSkeleton(): JSX.Element {
  return (
    <tr className="animate-pulse">
      <td className="min-w-[200px] px-3 py-2.5">
        <div className="h-4 w-40 rounded bg-cream-2" />
      </td>
      <td className="w-[110px] px-3 py-2.5">
        <div className="h-4 w-16 rounded bg-cream-2" />
      </td>
      <td className="w-[140px] px-3 py-2.5">
        <div className="h-4 w-20 rounded bg-cream-2" />
      </td>
      <td className="w-[190px] px-3 py-2.5">
        <div className="h-4 w-28 rounded bg-cream-2" />
      </td>
      <td className="w-[70px] px-3 py-2.5">
        <div className="h-4 w-8 rounded bg-cream-2" />
      </td>
      <td className="w-[160px] px-3 py-2.5" />
    </tr>
  )
}
