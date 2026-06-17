export interface LoginResponseDto {
  user: {
    uuid: string
    name: string
    username: string
    email: string
    phone: string
  }
  token: string
}
