import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { SerialCorrectionsRepository } from '../../domain/serial-corrections-repository'
import type { SerialCorrection, SerialCorrectionInput } from '../../domain/serial-correction.model'
import type {
  SerialCorrectionCollectionDto,
  SerialCorrectionResultDto,
} from '../dto/serial-correction.dto'
import { SerialCorrectionMapper } from '../mappers/serial-correction.mapper'

class SerialCorrectionsRepositoryImpl implements SerialCorrectionsRepository {
  private readonly datasource = HttpDataSource.getInstance()

  async list(stockId: string, page: number) {
    const response = await this.datasource.get<SerialCorrectionCollectionDto>(
      `/stocks/${stockId}/serial-corrections?page=${page}`,
    )
    return SerialCorrectionMapper.toPage(response)
  }

  async create(stockId: string, input: SerialCorrectionInput) {
    const response = await this.datasource.post<SerialCorrectionResultDto>(
      `/stocks/${stockId}/serial-corrections`,
      {
        serial: input.serial.trim().toUpperCase(),
        expected_serial: input.expectedSerial,
        reason: input.reason.trim() || null,
      },
    )
    return SerialCorrectionMapper.toResult(response)
  }

  async download(correction: SerialCorrection) {
    if (correction.receipt === null) throw new Error('Esta corrección no tiene acuse.')
    return this.datasource.getFile(correction.receipt.url, correction.receipt.filename)
  }
}

export const serialCorrectionsRepository = new SerialCorrectionsRepositoryImpl()
