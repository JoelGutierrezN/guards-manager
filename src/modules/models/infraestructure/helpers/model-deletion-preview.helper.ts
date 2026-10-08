import type { ProductModelDeletionPreview } from '../../domain/product-model-deletion-preview.model'

export class ModelDeletionPreviewHelper {
  static blockingReasons(preview: ProductModelDeletionPreview): string[] {
    const reasons: string[] = []
    if (!preview.isDiscontinued) {
      reasons.push('El modelo debe estar dado de baja antes de poder eliminarse.')
    }
    if (preview.pendingCustodiesCount > 0) {
      reasons.push(`${preview.pendingCustodiesCount} unidades siguen en resguardo activo.`)
    }
    return reasons
  }

  static totalAffectedStocks(preview: ProductModelDeletionPreview): number {
    return preview.affectedProducts.reduce((sum, product) => sum + product.stocksTotal, 0)
  }
}
