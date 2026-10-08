import type { UserPrimitives } from './user.interfaces'

export class User {
  private readonly id: string
  private email: string
  private name: string
  private username: string
  private phone: string | null

  constructor(id: string, email: string, name: string, username: string, phone: string | null) {
    this.id = id
    this.email = email
    this.name = name
    this.username = username
    this.phone = phone
  }

  static create(props: UserPrimitives): User {
    return new User(props.id, props.email, props.name, props.username, props.phone)
  }

  static fromPrimitives(props: UserPrimitives): User {
    return new User(props.id, props.email, props.name, props.username, props.phone)
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getUsername(): string {
    return this.username
  }

  getEmail(): string {
    return this.email
  }

  getPhone(): string | null {
    return this.phone
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      username: this.username,
      phone: this.phone,
    }
  }
}
