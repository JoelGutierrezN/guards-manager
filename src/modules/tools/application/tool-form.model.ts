import type { ToolInput } from '../domain/tool-input.model'

export type ToolFormPrefillStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ToolFormErrors {
  name?: string
  brandId?: string
  productModelId?: string
}

export interface ToolFormState {
  name: string
  brandId: string
  brandName: string
  productModelId: string
  productModelName: string
  prefillStatus: ToolFormPrefillStatus
  touched: boolean
  isSaving: boolean
  apiErrors: ToolFormErrors
  apiMessage: string | null
}

export interface ToolFormPrefill {
  brandId: string
  brandName: string
  productModelId: string
  productModelName: string
}

export type ToolFormAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_BRAND'; brandId: string; brandName: string }
  | { type: 'SET_PRODUCT_MODEL'; productModelId: string; productModelName: string }
  | { type: 'PREFILL_START' }
  | { type: 'PREFILL_SUCCESS'; prefill: ToolFormPrefill }
  | { type: 'PREFILL_ERROR' }
  | { type: 'TOUCH' }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; errors: ToolFormErrors; message: string }
  | { type: 'SAVE_DONE' }

/** Rechaza con el error de Axios para que el formulario pueda mapear el 422 por campo. */
export type ToolFormSubmit = (input: ToolInput) => Promise<void>
