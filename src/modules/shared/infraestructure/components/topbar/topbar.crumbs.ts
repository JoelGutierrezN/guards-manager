import type { UIMatch } from 'react-router'

export type Crumb = string | string[]

export interface CrumbHandle {
  crumb?: Crumb | ((match: UIMatch) => Crumb)
}

export class TopbarCrumbsResolver {
  /** Concatena las migas de cada ruta activa (`handle.crumb`), en orden de padre a hijo. */
  static resolve(matches: UIMatch[]): string[] {
    return matches.flatMap((match) => TopbarCrumbsResolver.resolveMatch(match))
  }

  private static resolveMatch(match: UIMatch): string[] {
    const handle = match.handle as CrumbHandle | undefined
    if (handle?.crumb == null) return []

    const crumb = typeof handle.crumb === 'function' ? handle.crumb(match) : handle.crumb
    return Array.isArray(crumb) ? crumb : [crumb]
  }
}
