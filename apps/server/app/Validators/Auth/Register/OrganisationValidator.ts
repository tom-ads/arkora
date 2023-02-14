import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { maxHourlyRate } from 'Config/app'

export default class OrganisationValidator {
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
    name: schema.string({ trim: true }),
    subdomain: schema.string([
      rules.regex(/^[a-z-]+$/),
      rules.unique({
        table: 'organisations',
        column: 'subdomain',
      }),
      // TODO: check for reserved words, ie. Arkora/arkora
    ]),
    work_days: schema
      .array([rules.minLength(1), rules.maxLength(7), rules.workDays()])
      .members(schema.string()),
    opening_time: schema.date({ format: 'iso' }, [rules.beforeField('closing_time')]),
    closing_time: schema.date({ format: 'iso' }, [rules.afterField('opening_time')]),
    currency: schema.string([rules.currencyCode()]),
    hourly_rate: schema.number([rules.range(0, maxHourlyRate)]),
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
    'name.required': 'Name is required',

    'subdomain.required': 'Subdomain is required',
    'subdomain.unique': 'Subdomain already taken',
    'subdomain.regex': 'Invalid subdomain, can only have letters and hyphens',

    'work_days.required': 'Work days are required',
    'work_days.enum': 'Invalid weekday',
    'work_days.minLength': '1 work day required',
    'work_days.maxLength': 'Can only have 7 work days per week',

    'opening_time.required': 'Opening time is required',
    'opening_time.beforeField': 'Opening time must be before the closing time',

    'closing_time.required': 'Closing time is required',
    'closing_time.afterField': 'Closing time must be after the opening time',

    'currency.required': 'Currency is required',

    'hourly_rate.required': 'Hourly rate is required',
    'hourly_rate.range': 'Hourly rate must be between 0 and 20000',
  }
}
