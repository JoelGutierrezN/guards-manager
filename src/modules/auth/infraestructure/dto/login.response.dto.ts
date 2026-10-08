export interface LoginResponseDto {
  user: {
    id: string
    name: string
    username: string
    email: string
    phone: string | null
  }
  token: string
  expiresAt: string
}
