export class User {
      constructor(private readonly id: string, private email: string, private password: string, private name: string, private phone: string) { }

      static create(props: { id: string, email: string, password: string, name: string, phone: string }): User {
            return new User(props.id, props.email, props.password, props.name, props.phone)
      }

      static fromPrimitives(props: { id: string, email: string, password: string, name: string, phone: string }): User {
            return new User(props.id, props.email, props.password, props.name, props.phone)
      }

      toPrimitives(): { id: string, email: string, password: string, name: string, phone: string } {
            return {
                  id: this.id,
                  email: this.email,
                  password: this.password,
                  name: this.name,
                  phone: this.phone
            }
      }
}