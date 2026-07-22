import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import queryString from 'query-string'
import type { QueryParams } from './query-params.model'

const PARSE_OPTIONS = { parseNumbers: true, parseBooleans: true } as const
const STRINGIFY_OPTIONS = { skipEmptyString: true, skipNull: true } as const

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo<QueryParams>(
    () => queryString.parse(searchParams.toString(), PARSE_OPTIONS) as QueryParams,
    [searchParams],
  )

  const setQueryParams = useCallback(
    (nextParams: QueryParams) => {
      setSearchParams(
        (currentParams) => {
          const merged: QueryParams = {
            ...(queryString.parse(currentParams.toString(), PARSE_OPTIONS) as QueryParams),
            ...nextParams,
          }
          return queryString.stringify(merged, STRINGIFY_OPTIONS)
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return { params, setQueryParams }
}
