export interface UserRepository {
      login(phone: string, password: string): Promise<string>
      login(email: string, password: string): Promise<string>

}
