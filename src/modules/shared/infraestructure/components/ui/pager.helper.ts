export class PagerPagesHelper {
  static buildPages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
    const clampedTotal = Math.max(1, totalPages)
    if (clampedTotal === 1) return [1]

    const surroundingPages = [currentPage - 1, currentPage, currentPage + 1].filter(
      (pageNumber) => pageNumber > 1 && pageNumber < clampedTotal,
    )

    const needsLeadingEllipsis = surroundingPages.length > 0 && surroundingPages[0] > 2
    const needsTrailingEllipsis =
      surroundingPages.length > 0 && surroundingPages[surroundingPages.length - 1] < clampedTotal - 1

    const result: Array<number | 'ellipsis'> = [1]

    if (needsLeadingEllipsis) result.push('ellipsis')
    result.push(...surroundingPages)
    if (needsTrailingEllipsis) result.push('ellipsis')
    result.push(clampedTotal)

    return result
  }
}
