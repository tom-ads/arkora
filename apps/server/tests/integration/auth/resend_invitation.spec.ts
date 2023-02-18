import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { OrganisationFactory } from 'Database/factories'
import UserFactory from 'Database/factories/UserFactory'
import { string } from '@ioc:Adonis/Core/Helpers'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('Auth : Resend Invitation', (group) => {
  let authUser: User
  let invitedUser: User
  let organisation: Organisation

  group.each.setup(async () => {
    organisation = await OrganisationFactory.create()

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Setup invited member
    invitedUser = await UserFactory.merge({
      organisationId: organisation.id,
      verificationCode: string.generateRandom(32),
      verifiedAt: null,
      email: 'test@example.com',
    })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()
  })

  test('organisation admin can resend an invitation', async ({ client, route }) => {
    Hash.fake()

    const payload = {
      userId: invitedUser.id,
    }

    const response = await client
      .post(route('AuthController.resendInvitation'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)

    Hash.restore()
  })

  test('organisation member cannot resend an invitation', async ({ client, route }) => {
    const member = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const payload = {
      userId: authUser.id,
    }

    const response = await client
      .post(route('AuthController.resendInvitation'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(member)

    response.assertStatus(403)
  })
})
