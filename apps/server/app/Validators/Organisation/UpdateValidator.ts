import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { maxHourlyRate } from 'Config/app'

export default class UpdateOrganisationValidator {
  constructor(protected ctx: HttpContextContract) {}

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
    opening_time: schema.date({ format: 'iso' }, [rules.beforeField('closing_time')]),
    closing_time: schema.date({ format: 'iso' }, [rules.afterField('opening_time')]),
    currency: schema.string([rules.currencyCode()]),
    default_rate: schema.number([rules.range(0, maxHourlyRate)]),
    break_duration: schema.number(),
    business_days: schema
      .array([rules.minLength(1), rules.maxLength(7), rules.workDays()])
      .members(schema.string()),
    default_tasks: schema.array([rules.distinct('name')]).members(
      schema.object().members({
        name: schema.string(),
        is_billable: schema.boolean(),
      })
    ),
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
    'firstname.required': 'Firstname is required',

    'lastname.required': 'Lastname is required',

    'email.required': 'Email is required',
    'email.email': 'Not a valid email address',

    'password.required': 'Password is required',
    'password.password': 'Password requirements not met',

    'password_confirmation.required': 'Confirm password is required',
  }
}
