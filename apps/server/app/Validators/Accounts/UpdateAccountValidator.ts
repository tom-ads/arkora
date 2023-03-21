import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRole from 'App/Enum/UserRole'

export default class UpdateAccountValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    authEmail: this.ctx.auth?.user?.email as string,
  })

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    firstname: schema.string.optional([rules.trim()]),
    lastname: schema.string.optional([rules.trim()]),
    email: schema.string.optional([
      rules.trim(),
      rules.email(),
      rules.organisationEmail(this.ctx.organisation!.id, this.refs.authEmail.value),
    ]),
    role: schema.enum.optional(Object.values(UserRole).filter((v) => v !== UserRole.OWNER)),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'email.organisationEmail': 'Email already taken',
  }
}
