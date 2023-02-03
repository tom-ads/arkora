import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BudgetKind from 'App/Enum/BudgetKind'
import BillableKind from 'App/Enum/BillableKind'

export default class CreateBudgetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    projectId: this.ctx.request.body()?.project_id,
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
    project_id: schema.number([rules.organisationProject(this.ctx.organisation!.id)]),
    name: schema.string([
      rules.trim(),
      rules.maxLength(50),
      rules.unique({
        table: 'budgets',
        column: 'name',
        where: {
          project_id: this.refs.projectId,
        },
      }),
    ]),
    colour: schema.string(),
    private: schema.boolean(),
    budget_type: schema.enum(Object.values(BudgetKind), [
      rules.exists({
        table: 'budget_types',
        column: 'name',
      }),
    ]),
    hourly_rate: schema.number.optional(),
    budget: schema.number(),
    billable_type: schema.enum.optional(Object.values(BillableKind), [
      rules.exists({
        table: 'billable_types',
        column: 'name',
      }),
      rules.requiredWhen('budget_type', '!=', BudgetKind.NON_BILLABLE),
    ]),
    fixed_price: schema.number.optional([rules.requiredWhen('budget_type', '=', BudgetKind.FIXED)]),
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
