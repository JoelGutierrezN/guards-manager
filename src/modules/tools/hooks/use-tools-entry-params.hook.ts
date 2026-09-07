import { useEffect, useMemo, useRef } from 'react'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import { ToolsEntryParamsHelper } from '../infraestructure/helpers/tools-entry-params.helper'

interface UseToolsEntryParamsOptions {
  onOpenCreate: () => void
}

export function useToolsEntryParams({ onOpenCreate }: UseToolsEntryParamsOptions) {
  const { params, setQueryParams } = useQueryParams()
  const hasHandledRef = useRef(false)

  const isCreateRequested = ToolsEntryParamsHelper.isCreateRequested(params.new)

  const returnTo = useMemo(
    () => ToolsEntryParamsHelper.safeReturnTo(params.returnTo),
    [params.returnTo],
  )

  useEffect(() => {
    if (!isCreateRequested || hasHandledRef.current) return
    hasHandledRef.current = true
    onOpenCreate()
    setQueryParams({ new: undefined })
  }, [isCreateRequested, onOpenCreate, setQueryParams])

  return { returnTo }
}
