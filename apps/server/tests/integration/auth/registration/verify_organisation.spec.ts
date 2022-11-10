import { test } from '@japa/runner'
import { CurrencyCode } from 'App/Enum/CurrencyCode'
import WeekDay from 'App/Enum/WeekDay'

test.group('Auth: Registration  Verify Organisation', () => {
  test('request returns a 204 due to valid payload', async ({ client }) => {
    const response = await client.post('/auth/register/organisation').form({
      name: 'Test Org',
      subdomain: 'testorg',
      opening_time: '09:00',
      closing_time: '17:00',
      work_days: [WeekDay.MONDAY],
      currency: CurrencyCode.GBP,
      hourly_rate: 10000, // pennies
    })

    response.assertStatus(204)
  })

  test('all fields are required and throws a 422 response', async ({ client }) => {
    const response = await client.post('/auth/register/organisation').form({
      name: '',
      subdomain: '',
      opening_time: '',
      closing_time: '',
      work_days: [],
      currency: '',
      hourly_rate: 0, // pennies
    })

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
          field: 'work_days',
          message: 'Work days are required',
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
