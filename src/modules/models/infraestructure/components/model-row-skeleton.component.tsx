import { type JSX } from 'react'
import { MODELS_TABLE_TD } from './models-table.model'

export function ModelRowSkeleton(): JSX.Element {
  return (
    <tr>
      <td className={`${MODELS_TABLE_TD} w-8`}>
        <div className="h-4 w-4 animate-pulse rounded-[4px] bg-cream-2" />
      </td>
      <td className={`${MODELS_TABLE_TD} w-[130px]`}>
        <div className="h-4 w-20 animate-pulse rounded bg-cream-2" />
      </td>
      <td className={`${MODELS_TABLE_TD} w-[170px] min-w-[200px]`}>
        <div className="h-4 w-28 animate-pulse rounded bg-cream-2" />
      </td>
      <td className={`${MODELS_TABLE_TD} w-20`}>
        <div className="h-4 w-8 animate-pulse rounded bg-cream-2" />
      </td>
      <td className={`${MODELS_TABLE_TD} w-[170px]`}>
        <div className="h-4 w-32 animate-pulse rounded bg-cream-2" />
      </td>
      <td className={`${MODELS_TABLE_TD} w-[150px]`}>
        <div className="ml-auto h-[26px] w-14 animate-pulse rounded-[10px] bg-cream-2/60" />
      </td>
    </tr>
  )
}
