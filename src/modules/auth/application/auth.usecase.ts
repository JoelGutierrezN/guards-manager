import { User } from "../domain/user.entity";
import type { UserRepository } from "../domain/user.repository";

export class AuthUseCase {
      constructor(private readonly userRepository: UserRepository) { }

      async login(emailOrPhone: string, password: string): Promise<User> {
            const user = await this.userRepository.authenticate(emailOrPhone, password);
            if (!user) {
                  throw new Error("User not found");
            }
            return User.fromPrimitives(JSON.parse(user));
      }

}