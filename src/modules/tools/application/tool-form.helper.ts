import type { Tool } from '../domain/tool.entity'
import type { ToolInput } from '../domain/tool-input.model'
import type { ToolFormErrors, ToolFormState } from './tool-form.model'

const MIN_NAME_LENGTH = 3
const MAX_NAME_LENGTH = 120
const UNKNOWN_LABEL = '—'

export class ToolFormHelper {
  static initialStateFrom(tool: Tool | null): ToolFormState {
    const hasIdentifiers = tool != null && tool.brandId !== null && tool.productModelId !== null
    return {
      name: tool?.name ?? '',
      brandId: tool?.brandId ?? '',
      brandName: ToolFormHelper.labelOf(tool?.brand),
      productModelId: tool?.productModelId ?? '',
      productModelName: ToolFormHelper.labelOf(tool?.model),
      prefillStatus: tool === null || hasIdentifiers ? 'ready' : 'idle',
      touched: false,
      isSaving: false,
      apiErrors: {},
      apiMessage: null,
    }
  }

  static validate(state: ToolFormState): ToolFormErrors {
    const errors: ToolFormErrors = {}
    const name = state.name.trim()

    if (name.length < MIN_NAME_LENGTH) errors.name = 'Escribe al menos 3 caracteres.'
    else if (name.length > MAX_NAME_LENGTH) errors.name = 'Máximo 120 caracteres.'

    if (state.brandId === '') errors.brandId = 'Selecciona una marca.'
    if (state.productModelId === '') errors.productModelId = 'Selecciona un modelo.'

    return errors
  }

  static hasErrors(errors: ToolFormErrors): boolean {
    return Object.values(errors).some((message) => message !== undefined)
  }

  static mergeErrors(local: ToolFormErrors, api: ToolFormErrors): ToolFormErrors {
    return {
      name: api.name ?? local.name,
      brandId: api.brandId ?? local.brandId,
      productModelId: api.productModelId ?? local.productModelId,
    }
  }

  static toInput(state: ToolFormState): ToolInput {
    return {
      name: state.name.trim(),
      brandId: state.brandId,
      productModelId: state.productModelId,
    }
  }

  private static labelOf(value: string | undefined): string {
    if (value === undefined || value === UNKNOWN_LABEL) return ''
    return value
  }
}
