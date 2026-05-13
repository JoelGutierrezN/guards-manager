import type { HttpDataSource } from "../../../shared/infraestructure/datasource/http.datasource";
import type { UserRepository as UserRepositoryContract } from "../../domain/user.repository";

export class AuthRepository implements UserRepositoryContract {
      constructor(private readonly datasource: HttpDataSource) { }
      async authenticate(emailOrPhone: string, password: string): Promise<string> {
            await this.datasource.post("/auth/login", { emailOrPhone: emailOrPhone, password: password });
            //TODO: return response from datasource and handle errors and create instance of User entity from response
            return "ok"
      }
      findByEmail(_email: string, _password: string): Promise<string> {
            throw new Error("Method not implemented.");
      }

}