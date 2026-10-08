const SIZE_UNITS = ['B', 'KB', 'MB', 'GB']
const BYTES_PER_UNIT = 1024

/** Único formateador de tamaños del proyecto: la misma hoja PDF debe leerse igual en la
 *  pantalla de firma y en la pestaña Documentos del expediente. */
export class FileSizeHelper {
  static label(sizeBytes: number): string {
    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return `0 ${SIZE_UNITS[0]}`
    const unitIndex = Math.min(
      Math.floor(Math.log(sizeBytes) / Math.log(BYTES_PER_UNIT)),
      SIZE_UNITS.length - 1,
    )
    const value = sizeBytes / BYTES_PER_UNIT ** unitIndex
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${SIZE_UNITS[unitIndex]}`
  }
}
