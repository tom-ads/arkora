import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateBudgetTaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    projectId: this.ctx.request.body()?.project_id as number,
    budgetId: this.ctx.request.body()?.budget_id as number,
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
    name: schema.string(),
    is_billable: schema.boolean(),
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
    'name.unique': 'Name already taken',
  }
}
