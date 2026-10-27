import type { DownloadedFile } from '../../shared/domain/downloaded-file.model'
import type {
  SerialCorrection,
  SerialCorrectionInput,
  SerialCorrectionResult,
  SerialCorrectionsPage,
} from './serial-correction.model'

export interface SerialCorrectionsRepository {
  list(stockId: string, page: number): Promise<SerialCorrectionsPage>
  create(stockId: string, input: SerialCorrectionInput): Promise<SerialCorrectionResult>
  download(correction: SerialCorrection): Promise<DownloadedFile>
}
