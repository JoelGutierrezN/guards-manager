export interface NameCheckMatch {
  id: string
  name: string
  active: boolean
}

export interface ProductModelNameCheck {
  exists: boolean
  exactMatch: NameCheckMatch | null
  similar: NameCheckMatch[]
}
