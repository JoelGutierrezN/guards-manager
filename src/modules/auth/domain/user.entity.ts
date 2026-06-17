import type { UserPrimitives } from './user.interfaces'

export class User {
  private readonly uuid: string
  private email: string
  private name: string
  private username: string
  private phone: string

  constructor(uuid: string, email: string, name: string, username: string, phone: string) {
    this.uuid = uuid
    this.email = email
    this.name = name
    this.username = username
    this.phone = phone
  }

  static create(props: UserPrimitives): User {
    return new User(props.uuid, props.email, props.name, props.username, props.phone)
  }

  static fromPrimitives(props: UserPrimitives): User {
    return new User(props.uuid, props.email, props.name, props.username, props.phone)
  }

  getName(): string {
    return this.name
  }

  toPrimitives(): UserPrimitives {
    return {
      uuid: this.uuid,
      email: this.email,
      name: this.name,
      username: this.username,
      phone: this.phone,
    }
  }
}
