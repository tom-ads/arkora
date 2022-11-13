import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import WeekDay from 'App/Enum/WeekDay'
import Organisation from 'App/Models/Organisation'
import { OrganisationFactory, UserFactory } from 'Database/factories'

const registerRoute = '/auth/register'

test.group('Auth: Registration - Register', () => {
  test('user can register their organisation and invite team members', async ({
    client,
    assert,
  }) => {
    const response = await client.post(registerRoute).form(payload).withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        firstname: 'bob',
        lastname: 'marley',
        email: 'bob.marley@example.com',
      },
      organisation: {
        name: 'test-org',
        subdomain: 'test-org',
        opening_time: '09:00',
        closing_time: '17:00',
        default_rate: 10000,
      },
    })

    const createdOrganisation = await Organisation.findBy('subdomain', payload.subdomain)
    assert.exists(createdOrganisation)

    assert.notStrictEqual(
      createdOrganisation?.workDays.map((day) => day.name),
      payload.work_days
    )
    assert.equal(createdOrganisation?.currency.code, payload.currency)
  })

  test('user cannot register an organisation that already exists with same subdomain', async ({
    client,
  }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client.post(registerRoute).form(payload).withCsrfToken()

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'subdomain',
          message: 'Subdomain already taken',
          rule: 'unique',
        },
      ],
    })
  })

  test('auth user is forbidden from registering an organisation', async ({ client }) => {
    const authUser = await UserFactory.create()

    const response = await client
      .post(registerRoute)
      .loginAs(authUser)
      .form(payload)
      .withCsrfToken()

    response.assertStatus(403)
  })
})

const payload = {
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
}
