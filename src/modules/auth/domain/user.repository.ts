export interface UserRepository {
      authenticate(emailOrPhone: string, password: string): Promise<string>
      findByEmail(email: string, password: string): Promise<string>

}
