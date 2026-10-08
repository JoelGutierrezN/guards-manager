import type { DownloadedFile } from '../../domain/downloaded-file.model'

const REVOKE_DELAY_MS = 1000

export class FileDownloadHelper {
  static save(file: DownloadedFile): void {
    const objectUrl = URL.createObjectURL(file.blob)
    const anchor = document.createElement('a')

    anchor.href = objectUrl
    anchor.download = file.filename
    document.body.append(anchor)
    anchor.click()
    anchor.remove()

    setTimeout(() => URL.revokeObjectURL(objectUrl), REVOKE_DELAY_MS)
  }
}
