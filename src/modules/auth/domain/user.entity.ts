export class User {
  constructor (
    private readonly id: string,
    private email: string,
    private name: string,
    private phone: string
  ) {}

  static create (props: {
    id: string
    email: string
    name: string
    phone: string
  }): User {
    return new User(props.id, props.email, props.name, props.phone)
  }

  static fromPrimitives (props: {
    id: string
    email: string
    name: string
    phone: string
  }): User {
    return new User(props.id, props.email, props.name, props.phone)
  }

  toPrimitives (): { id: string; email: string; name: string; phone: string } {
    return {
      id: this.id,
      email: this.email,

      name: this.name,
      phone: this.phone
    }
  }
}
