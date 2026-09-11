export interface CreateUserInput {
  name: string
  email: string
  username: string
  phone: string | null
  password: string
}

export interface UpdateUserInput {
  name: string
  email: string
  username: string
  phone: string | null
  password: string | null
}
