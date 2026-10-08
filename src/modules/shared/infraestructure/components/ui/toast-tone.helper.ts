import type { ToastTone } from './toast.model'

export class ToastToneHelper {
  private static readonly DOT_CLASS_NAME_BY_TONE: Record<ToastTone, string> = {
    success: 'bg-[#5fc97a] shadow-[0_0_8px_#5fc97a]',
    error: 'bg-[#f26a6a] shadow-[0_0_8px_#f26a6a]',
    info: 'bg-[#6a9bf2] shadow-[0_0_8px_#6a9bf2]',
  }

  static dotClassNameFor(tone: ToastTone): string {
    return ToastToneHelper.DOT_CLASS_NAME_BY_TONE[tone]
  }
}
