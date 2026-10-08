const ENCODED_FILENAME_PATTERN = /filename\*=\s*utf-8''([^;]+)/i
const PLAIN_FILENAME_PATTERN = /filename\s*=\s*"?([^";]+)"?/i

export class ContentDispositionHelper {
  static filenameFrom(header: unknown, fallback: string): string {
    if (typeof header !== 'string') return fallback

    const encoded = ENCODED_FILENAME_PATTERN.exec(header)
    if (encoded != null) return ContentDispositionHelper.decode(encoded[1], fallback)

    const plain = PLAIN_FILENAME_PATTERN.exec(header)
    if (plain == null) return fallback

    const filename = plain[1].trim()
    return filename !== '' ? filename : fallback
  }

  private static decode(value: string, fallback: string): string {
    try {
      const filename = decodeURIComponent(value.trim())
      return filename !== '' ? filename : fallback
    } catch {
      return fallback
    }
  }
}
