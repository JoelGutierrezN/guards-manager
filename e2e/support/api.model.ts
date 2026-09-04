export interface AuthenticatedUser {
  uuid: string
  name: string
  username: string
  email: string
  phone: string
}

export interface LoginResponse {
  user: AuthenticatedUser
  token: string
}

export interface CreatedBrand {
  id: string
  name: string
}

export interface CreatedProductModel {
  id: string
  name: string
}

export interface CreatedProduct {
  id: string
  name: string
}

export interface CreatedEmployee {
  id: string
  identifier: string
  name: string
}

export interface RoleOption {
  id: string
  name: string
}

export interface CreateProductInput {
  brandId: string
  productModelId: string
  name?: string
}

export interface CreateEmployeeInput {
  roleId: string
  name?: string
  email?: string
  phone?: string
}
