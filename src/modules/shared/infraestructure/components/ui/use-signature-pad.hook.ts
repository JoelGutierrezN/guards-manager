import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { SignaturePadHelper } from './signature-pad.helper'
import type { SignatureStroke } from './signature-pad.model'

export interface SignaturePadController {
  canvasRef: RefObject<HTMLCanvasElement | null>
  isEmpty: boolean
  startStroke: (clientX: number, clientY: number) => void
  extendStroke: (clientX: number, clientY: number) => void
  endStroke: () => void
  undo: () => void
  clear: () => void
}

export function useSignaturePad(
  onChange: (dataUrl: string | null) => void,
): SignaturePadController {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const strokesRef = useRef<SignatureStroke[]>([])
  const isDrawingRef = useRef(false)
  const [isEmpty, setIsEmpty] = useState(true)

  const repaint = useCallback((): void => {
    const canvas = canvasRef.current
    if (canvas === null) return
    SignaturePadHelper.redraw(canvas, strokesRef.current)
  }, [])

  const publish = useCallback((): void => {
    const canvas = canvasRef.current
    const empty = SignaturePadHelper.isEmpty(strokesRef.current)
    setIsEmpty(empty)
    if (canvas === null || empty) {
      onChange(null)
      return
    }
    onChange(SignaturePadHelper.toDataUrl(canvas))
  }, [onChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries
      if (entry === undefined) return
      SignaturePadHelper.resize(canvas, {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
      SignaturePadHelper.redraw(canvas, strokesRef.current)
    })

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const startStroke = useCallback(
    (clientX: number, clientY: number): void => {
      const canvas = canvasRef.current
      if (canvas === null) return
      isDrawingRef.current = true
      strokesRef.current = [
        ...strokesRef.current,
        [SignaturePadHelper.pointFrom(canvas, clientX, clientY)],
      ]
      repaint()
    },
    [repaint],
  )

  const extendStroke = useCallback(
    (clientX: number, clientY: number): void => {
      const canvas = canvasRef.current
      if (canvas === null || !isDrawingRef.current) return
      const currentStroke = strokesRef.current.at(-1)
      if (currentStroke === undefined) return
      currentStroke.push(SignaturePadHelper.pointFrom(canvas, clientX, clientY))
      repaint()
    },
    [repaint],
  )

  const endStroke = useCallback((): void => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    publish()
  }, [publish])

  const undo = useCallback((): void => {
    if (strokesRef.current.length === 0) return
    strokesRef.current = strokesRef.current.slice(0, -1)
    repaint()
    publish()
  }, [repaint, publish])

  const clear = useCallback((): void => {
    if (strokesRef.current.length === 0) return
    strokesRef.current = []
    repaint()
    publish()
  }, [repaint, publish])

  return { canvasRef, isEmpty, startStroke, extendStroke, endStroke, undo, clear }
}
