import type { SignSheetInput } from '../../domain/signature-input.model'
import type { SignatureResult } from '../../domain/signature.entity'
import type { SignatureRequestDto, SignatureResultDto } from '../dto/signature.dto'
import { CustodyMapper } from './custody.mapper'

export class SignatureMapper {
  static toRequestBody(input: SignSheetInput): SignatureRequestDto {
    return { image: input.image, signer_name: input.signerName.trim() }
  }

  static toResult(dto: SignatureResultDto): SignatureResult {
    return {
      signature: {
        id: dto.signature.id,
        signedAt: dto.signature.signedAt,
        signerName: dto.signature.signerName,
      },
      sheet: CustodyMapper.toSheet(dto.sheet ?? null),
    }
  }
}
