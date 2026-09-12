import { useCallback, useState } from 'react'
import { FileDownloadHelper } from '../../shared/infraestructure/helpers/file-download.helper'
import { toolsRepository } from '../infraestructure/repositories/tools.repository'
import { ProductExportErrorHelper } from '../infraestructure/helpers/product-export-error.helper'
import { ToolsQueryParamsHelper } from '../infraestructure/helpers/tools-query-params.helper'
import type { ToolsListRequest } from '../infraestructure/helpers/tools-query-params.helper'

export interface ToolsExportResult {
  message: string
  succeeded: boolean
}

export function useToolsExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportProducts = useCallback(
    async (request: ToolsListRequest): Promise<ToolsExportResult> => {
      setIsExporting(true)
      try {
        const file = await toolsRepository.exportProducts(
          ToolsQueryParamsHelper.toApiParams(request),
        )
        FileDownloadHelper.save(file)
        return { message: `Exportación descargada: ${file.filename}`, succeeded: true }
      } catch (error) {
        return { message: await ProductExportErrorHelper.messageFrom(error), succeeded: false }
      } finally {
        setIsExporting(false)
      }
    },
    [],
  )

  return { isExporting, exportProducts }
}
