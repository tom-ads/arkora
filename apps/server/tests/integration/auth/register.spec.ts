import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import WeekDay from 'App/Enum/WeekDay'
import Organisation from 'App/Models/Organisation'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Auth : Registration - Register', (group) => {
  group.tap((test) => test.tags(['@auth-register']))

  test('user can register their organisation and invite team members', async ({
    client,
    assert,
    route,
  }) => {
    const response = await client.post(route('AuthController.register')).form(payload)
    // .withCsrfToken()
    // console.log(response.session())
    // console.log(response.cookies())
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
      payload.business_days
    )
    assert.equal(createdOrganisation?.currency.code, payload.currency)
  })

  //   test('user cannot register an organisation that already exists with same subdomain', async ({
  //     client,
  //     route,
  //   }) => {
  //     await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

  //     const response = await client
  //       .post(route('AuthController.register'))
  //       .form(payload)
  //       .withCsrfToken()

  //     response.assertBodyContains({
  //       errors: [
  //         {
  //           field: 'subdomain',
  //           message: 'Subdomain already taken',
  //           rule: 'unique',
  //         },
  //       ],
  //     })
  //   })

  //   test('auth user is forbidden from registering an organisation', async ({ client, route }) => {
  //     const authUser = await UserFactory.create()

  //     const response = await client
  //       .post(route('AuthController.register'))
  //       .loginAs(authUser)
  //       .form(payload)
  //       .withCsrfToken()

  //     response.assertStatus(403)
  //   })
})

const payload = {
  firstname: 'bob',
  lastname: 'marley',
  email: 'bob.marley@example.com',
  password: 'newPassword123!',
  password_confirmation: 'newPassword123!',

  name: 'test-org',
  subdomain: 'test-org',
  business_days: [WeekDay.MONDAY, WeekDay.TUESDAY],
  opening_time: '09:00',
  closing_time: '17:00',
  break_duration: 30,
  currency: 'GBP',
  default_rate: 10000,

  team: [
    {
      email: 'ta@example.com',
      role: UserRole.MEMBER,
    },
  ],
}
