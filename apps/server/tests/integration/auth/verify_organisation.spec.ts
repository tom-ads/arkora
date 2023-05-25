import { test } from '@japa/runner'
import { CurrencyCode } from 'App/Enum/CurrencyCode'
import WeekDay from 'App/Enum/WeekDay'

test.group('Auth : Registration - Verify Organisation', () => {
  test('request returns a 204 due to valid payload', async ({ client, route }) => {
    const response = await client
      .post(route('AuthController.verifyOrganisation'))
      .form({
        name: 'Test Org',
        subdomain: 'testorg',
        opening_time: '09:00',
        closing_time: '17:00',
        break_duration: 30,
        business_days: [WeekDay.MONDAY],
        currency: CurrencyCode.GBP,
        default_rate: 10000, // pennies
      })
      .withCsrfToken()

    response.assertStatus(204)
  })

  test('all fields are required and throws a 422 response', async ({ client, route }) => {
    const response = await client
      .post(route('AuthController.verifyOrganisation'))
      .form({
        name: '',
        subdomain: '',
        opening_time: '',
        closing_time: '',
        break_duration: 0,
        business_days: [],
        currency: '',
        default_rate: 0, // pennies
      })
      .withCsrfToken()

    response.assertStatus(422)
    response.assertBody({
      errors: [
        {
          field: 'name',
          message: 'Name is required',
          rule: 'required',
        },
        {
          field: 'subdomain',
          message: 'Subdomain is required',
          rule: 'required',
        },
        {
          field: 'business_days',
          message: 'Business days are required',
          rule: 'required',
        },
        {
          field: 'opening_time',
          message: 'Opening time is required',
          rule: 'required',
        },
        {
          field: 'closing_time',
          message: 'Closing time is required',
          rule: 'required',
        },
        {
          field: 'currency',
          message: 'Currency is required',
          rule: 'required',
        },
      ],
    })
  })
})
