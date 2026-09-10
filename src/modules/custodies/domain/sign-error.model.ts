export interface SignFieldErrors {
  image?: string
  signerName?: string
}

export interface SignErrorReport {
  message: string
  reasons: string[]
  fieldErrors: SignFieldErrors
  alreadySigned: boolean
}
