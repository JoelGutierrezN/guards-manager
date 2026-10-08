import { useCallback, useState } from 'react'
import { FileDownloadHelper } from '../../shared/infraestructure/helpers/file-download.helper'
import type { SheetDownloadResult } from '../application/sheet-download-result.model'
import type { SheetTarget } from '../domain/sheet-target.model'
import { SignErrorHelper } from '../infraestructure/helpers/sign-error.helper'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'

interface UseSheetDownloadResult {
  downloading: boolean
  download: (target: SheetTarget) => Promise<SheetDownloadResult>
}

export function useSheetDownload(): UseSheetDownloadResult {
  const [downloading, setDownloading] = useState(false)

  const download = useCallback(async (target: SheetTarget): Promise<SheetDownloadResult> => {
    setDownloading(true)
    try {
      const file = await custodiesRepository.downloadSheet(target.url, target.filename)
      FileDownloadHelper.save(file)
      return { message: `Hoja descargada: ${file.filename}`, succeeded: true }
    } catch (error) {
      return { message: await SignErrorHelper.downloadMessageFrom(error), succeeded: false }
    } finally {
      setDownloading(false)
    }
  }, [])

  return { downloading, download }
}
