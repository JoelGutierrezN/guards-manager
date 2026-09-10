import type { SignaturePadSize, SignaturePoint, SignatureStroke } from './signature-pad.model'

const BACKGROUND_COLOR = '#ffffff'
const STROKE_COLOR = '#1a1326'
const STROKE_WIDTH = 2.2
const MAX_PIXEL_RATIO = 2

/**
 * El trazo se guarda en píxeles CSS y el lienzo se escala al `devicePixelRatio` para que la
 * firma se vea nítida en pantallas HiDPI y el PNG exportado conserve esa resolución.
 */
export class SignaturePadHelper {
  static pixelRatio(): number {
    const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio
    if (!Number.isFinite(ratio) || ratio <= 0) return 1
    return Math.min(ratio, MAX_PIXEL_RATIO)
  }

  static resize(canvas: HTMLCanvasElement, size: SignaturePadSize): void {
    const ratio = SignaturePadHelper.pixelRatio()
    canvas.width = Math.max(1, Math.round(size.width * ratio))
    canvas.height = Math.max(1, Math.round(size.height * ratio))
  }

  static redraw(canvas: HTMLCanvasElement, strokes: readonly SignatureStroke[]): void {
    const context = canvas.getContext('2d')
    if (context === null) return

    const ratio = SignaturePadHelper.pixelRatio()
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.fillStyle = BACKGROUND_COLOR
    context.fillRect(0, 0, canvas.width / ratio, canvas.height / ratio)

    context.strokeStyle = STROKE_COLOR
    context.lineWidth = STROKE_WIDTH
    context.lineCap = 'round'
    context.lineJoin = 'round'

    strokes.forEach((stroke) => SignaturePadHelper.drawStroke(context, stroke))
  }

  static pointFrom(canvas: HTMLCanvasElement, clientX: number, clientY: number): SignaturePoint {
    const bounds = canvas.getBoundingClientRect()
    return { x: clientX - bounds.left, y: clientY - bounds.top }
  }

  static isEmpty(strokes: readonly SignatureStroke[]): boolean {
    return !strokes.some((stroke) => stroke.length > 0)
  }

  static toDataUrl(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png')
  }

  private static drawStroke(context: CanvasRenderingContext2D, stroke: SignatureStroke): void {
    const [first] = stroke
    if (first === undefined) return

    context.beginPath()
    if (stroke.length === 1) {
      context.arc(first.x, first.y, STROKE_WIDTH / 2, 0, Math.PI * 2)
      context.fillStyle = STROKE_COLOR
      context.fill()
      return
    }

    context.moveTo(first.x, first.y)
    stroke.slice(1).forEach((point) => context.lineTo(point.x, point.y))
    context.stroke()
  }
}
