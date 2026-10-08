import { type JSX, type PointerEvent, useCallback, useMemo } from 'react'
import { Eraser01Icon, Undo02Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../utils/cn'
import { Button } from './button.component'
import { useSignaturePad } from './use-signature-pad.hook'

interface Props {
  onChange: (dataUrl: string | null) => void
  disabled?: boolean
  invalid?: boolean
  hint?: string
  ariaLabel?: string
}

const DEFAULT_HINT = 'Traza la firma dentro del recuadro con el ratón o el dedo.'
const DEFAULT_ARIA_LABEL = 'Área de firma'

export function SignaturePad({
  onChange,
  disabled = false,
  invalid = false,
  hint = DEFAULT_HINT,
  ariaLabel = DEFAULT_ARIA_LABEL,
}: Props): JSX.Element {
  const { canvasRef, isEmpty, startStroke, extendStroke, endStroke, undo, clear } =
    useSignaturePad(onChange)

  const canvasClassName = useMemo(
    () =>
      cn(
        'block h-[200px] w-full touch-none rounded-[14px] border bg-white transition-[border-color,box-shadow]',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-crosshair',
        invalid
          ? 'border-danger shadow-[0_0_0_3px_var(--color-danger-soft)]'
          : 'border-hairline-strong',
      ),
    [disabled, invalid],
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLCanvasElement>): void => {
      if (disabled) return
      startStroke(event.clientX, event.clientY)
    },
    [disabled, startStroke],
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>): void => {
      if (disabled) return
      extendStroke(event.clientX, event.clientY)
    },
    [disabled, extendStroke],
  )

  const handlePointerUp = useCallback((): void => endStroke(), [endStroke])

  return (
    <div className="flex w-full flex-col gap-2">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        aria-disabled={disabled}
        className={canvasClassName}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-muted">{hint}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={Undo02Icon}
            disabled={disabled || isEmpty}
            onClick={undo}
          >
            Deshacer
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={Eraser01Icon}
            disabled={disabled || isEmpty}
            onClick={clear}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  )
}
