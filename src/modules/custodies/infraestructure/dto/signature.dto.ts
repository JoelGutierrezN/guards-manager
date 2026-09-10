import type { CustodySheetDto } from './custody.dto'

export interface SignatureDto {
  id: string
  signedAt: string
  signerName: string
}

export interface SignatureResultDto {
  signature: SignatureDto
  sheet: CustodySheetDto
}

export interface SignatureRequestDto {
  image: string
  signer_name: string
}
