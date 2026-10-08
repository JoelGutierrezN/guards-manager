import type { CustodySheet } from './custody.entity'

export interface Signature {
  id: string
  signedAt: string
  signerName: string
}

export interface SignatureResult {
  signature: Signature
  sheet: CustodySheet | null
}
