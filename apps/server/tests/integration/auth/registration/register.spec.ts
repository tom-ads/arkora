import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import WeekDay from 'App/Enum/WeekDay'

test.group('Auth: Registration - Register', () => {
  test('user can onboard their organisation and invite team members', async ({ client }) => {
    const response = await client.post('/auth/register').form({
      firstname: 'bob',
      lastname: 'marley',
      email: 'bob.marley@example.com',
      password: 'newPassword123!',
      password_confirmation: 'newPassword123!',

      name: 'test-org',
      subdomain: 'test-org',
      work_days: [WeekDay.MONDAY, WeekDay.TUESDAY],
      opening_time: '09:00',
      closing_time: '17:00',
      currency: 'GBP',
      hourly_rate: 10000,

      team: [
        {
          email: 'ta@example.com',
          role: UserRole.MEMBER,
        },
      ],
    })

    response.assertStatus(200)
    response.assertBody({
      user: {
        id: 1,
        firstname: 'bob',
        lastname: 'marley',
        email: 'bob.marley@example.com',
      },
      organisation: {
        id: 1,
        currency_id: 50,
        name: 'test-org',
        subdomain: 'test-org',
        opening_time: '2022-11-08T09:00:00.00000:00',
        closing_time: '2022-11-08T17:00:00.00000:00',
        default_rate: 10000,
      },
    })
  })
})
