import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useParams } from 'react-router'
import type { SheetDownloadResult } from '../application/sheet-download-result.model'
import { SignDocumentHelper } from '../application/sign-document.helper'
import { SignPresenter } from '../application/sign-presenter.helper'
import { INITIAL_SIGN_STATE, type SignState } from '../application/sign-state.model'
import { signReducer } from '../application/sign.reducer'
import type { SheetTarget } from '../domain/sheet-target.model'
import type { SignatureResult } from '../domain/signature.entity'
import { SheetPathHelper } from '../infraestructure/helpers/sheet-path.helper'
import { SignErrorHelper } from '../infraestructure/helpers/sign-error.helper'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'
import { useSheetDownload } from './use-sheet-download.hook'

interface SignHero {
  title: string
  italic: string
  lede: string
}

interface UseSignatureResult {
  state: SignState
  hero: SignHero
  canSubmit: boolean
  isNotFound: boolean
  alreadySigned: boolean
  downloading: boolean
  reload: () => void
  setSignerName: (signerName: string) => void
  setSignatureImage: (image: string | null) => void
  submit: () => Promise<SignatureResult | null>
  downloadSheet: () => Promise<SheetDownloadResult | null>
}

const EMPTY_HERO: SignHero = { title: '', italic: '', lede: '' }

export function useSignature(): UseSignatureResult {
  const { custodyId, returnId } = useParams<{ custodyId: string; returnId?: string }>()
  const [state, dispatch] = useReducer(signReducer, INITIAL_SIGN_STATE)
  const { downloading, download } = useSheetDownload()

  const load = useCallback(
    async (targetCustodyId: string, targetReturnId: string | null): Promise<void> => {
      dispatch({ type: 'LOAD_START' })
      try {
        const signDocument =
          targetReturnId === null
            ? SignDocumentHelper.fromCustody(await custodiesRepository.get(targetCustodyId))
            : SignDocumentHelper.fromReturn(await custodiesRepository.getReturn(targetReturnId))
        dispatch({ type: 'LOAD_SUCCESS', payload: signDocument })
      } catch (error) {
        dispatch({ type: 'LOAD_ERROR', payload: SignErrorHelper.loadMessageFrom(error) })
      }
    },
    [],
  )

  const targetReturnId = returnId == null || returnId === '' ? null : returnId

  useEffect(() => {
    if (custodyId == null || custodyId === '') {
      dispatch({ type: 'LOAD_ERROR', payload: SignErrorHelper.notFoundMessage() })
      return
    }
    void load(custodyId, targetReturnId)
  }, [custodyId, targetReturnId, load])

  const reload = useCallback(() => {
    if (custodyId == null || custodyId === '') return
    void load(custodyId, targetReturnId)
  }, [custodyId, targetReturnId, load])

  const setSignerName = useCallback((signerName: string) => {
    dispatch({ type: 'SIGNER_NAME_CHANGED', payload: signerName })
  }, [])

  const setSignatureImage = useCallback((image: string | null) => {
    dispatch({ type: 'SIGNATURE_CHANGED', payload: image })
  }, [])

  const { signDocument, status, signerName, signatureImage, result } = state

  const submit = useCallback(async (): Promise<SignatureResult | null> => {
    if (signDocument === null || status !== 'editing') return null

    if (signerName.trim() === '') {
      dispatch({ type: 'SUBMIT_ERROR', payload: SignErrorHelper.emptySignerReport() })
      return null
    }
    if (signatureImage === null) {
      dispatch({ type: 'SUBMIT_ERROR', payload: SignErrorHelper.emptySignatureReport() })
      return null
    }

    dispatch({ type: 'SUBMIT_START' })
    const input = { image: signatureImage, signerName }
    try {
      const signature =
        signDocument.type === 'resguardo'
          ? await custodiesRepository.signCustody(signDocument.id, input)
          : await custodiesRepository.signReturn(signDocument.id, input)
      dispatch({ type: 'SUBMIT_SUCCESS', payload: signature })
      return signature
    } catch (error) {
      dispatch({ type: 'SUBMIT_ERROR', payload: SignErrorHelper.reportFrom(error) })
      return null
    }
  }, [signDocument, status, signerName, signatureImage])

  const sheetTarget = useMemo<SheetTarget | null>(() => {
    if (signDocument === null) return null
    const sheet = result?.sheet ?? signDocument.sheet
    if (signDocument.type === 'resguardo') {
      return SheetPathHelper.custodyTarget(signDocument.id, signDocument.code, sheet)
    }
    return SheetPathHelper.returnTarget(signDocument.id, signDocument.code, sheet)
  }, [signDocument, result])

  const downloadSheet = useCallback(async (): Promise<SheetDownloadResult | null> => {
    if (sheetTarget === null) return null
    return download(sheetTarget)
  }, [sheetTarget, download])

  const hero = useMemo<SignHero>(() => {
    if (signDocument === null) return EMPTY_HERO
    return {
      title: SignPresenter.heroTitle(signDocument),
      italic: signDocument.code,
      lede: SignPresenter.heroLede(signDocument),
    }
  }, [signDocument])

  const alreadySigned = signDocument !== null && signDocument.signedAt !== null
  const canSubmit = status === 'editing' && !alreadySigned

  return {
    state,
    hero,
    canSubmit,
    isNotFound: status === 'error' && SignErrorHelper.isNotFound(state.loadError),
    alreadySigned,
    downloading,
    reload,
    setSignerName,
    setSignatureImage,
    submit,
    downloadSheet,
  }
}
