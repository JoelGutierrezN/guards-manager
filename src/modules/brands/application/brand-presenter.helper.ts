const KNOWN_BRAND_COLORS: Record<string, string> = {
  DeWalt: '#FCBA00',
  Makita: '#0E7C3A',
  Milwaukee: '#D7202C',
  Bosch: '#0073B5',
  Fluke: '#FCD600',
}

const FALLBACK_PALETTE = ['#0E7C3A', '#0073B5', '#D7202C', '#FCBA00', '#7A3FF2', '#0E0F3C']

export class BrandPresenter {
  static initial(name: string): string {
    return (name.trim()[0] ?? '?').toUpperCase()
  }

  static color(name: string): string {
    const known = KNOWN_BRAND_COLORS[name]
    if (known) return known

    let hash = 0
    for (const char of name) {
      hash = (hash + char.charCodeAt(0)) % FALLBACK_PALETTE.length
    }
    return FALLBACK_PALETTE[hash]
  }
}
