export interface ChangePasswordRequestDto {
  current_password: string
  password: string
  password_confirmation: string
}
