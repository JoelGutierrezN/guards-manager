export class FileDropzoneHelper {
  static extensionMatches(fileName: string, accept: string): boolean {
    const acceptedExtensions = accept
      .split(',')
      .map((extension) => extension.trim().toLowerCase())
      .filter((extension) => extension !== '')
    if (acceptedExtensions.length === 0) return true

    const normalizedName = fileName.toLowerCase()
    return acceptedExtensions.some((extension) => normalizedName.endsWith(extension))
  }

  static firstFileFrom(dataTransfer: DataTransfer): File | null {
    const [firstFile] = Array.from(dataTransfer.files)
    return firstFile ?? null
  }
}
