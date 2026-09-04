export interface StorageStateEntry {
  name: string
  value: string
}

export interface StorageStateOrigin {
  origin: string
  localStorage: StorageStateEntry[]
}

export interface StorageStateFile {
  cookies: never[]
  origins: StorageStateOrigin[]
}
