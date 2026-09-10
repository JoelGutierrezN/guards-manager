/** Cuerpo de `POST /custodies/{id}/signature` y `POST /returns/{id}/signature` (5.9 del plan). */
export interface SignSheetInput {
  image: string
  signerName: string
}
