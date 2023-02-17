import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { OrganisationFactory } from 'Database/factories'
import UserFactory from 'Database/factories/UserFactory'
import { string } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'

test.group('Auth : Verify Invitation', (group) => {
  let invitedUser: User
  let organisation: Organisation
  let token: string

  group.each.setup(async () => {
    organisation = await OrganisationFactory.create()

    token = string.generateRandom(32)

    // Setup organisation owner
    invitedUser = await UserFactory.merge({
      organisationId: organisation.id,
      verificationCode: token,
      verifiedAt: null,
      email: 'test@example.com',
    })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()
  })

  test('organisation invitee can verify and create their account', async ({ client, route }) => {
    const payload = {
      token,
      userId: invitedUser.id,
      firstname: 'bob',
      lastname: 'marley',
      password: 'testPassword123!',
      password_confirmation: 'testPassword123!',
    }

    const response = await client
      .post(route('AuthController.verifyInvitation'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    await invitedUser.refresh()

    response.assertStatus(200)
    response.assertBodyContains({
      user: invitedUser.serialize(),
      organisation: organisation.serialize(),
    })
  })

  test('organisation invitee cannot verify again after being verified', async ({
    client,
    route,
  }) => {
    invitedUser.verificationCode = null
    invitedUser.verifiedAt = DateTime.now().set({ millisecond: 0 })
    await invitedUser.save()

    const payload = {
      token,
      userId: invitedUser.id,
      firstname: 'bob',
      lastname: 'marley',
      password: 'testPassword123!',
      password_confirmation: 'testPassword123!',
    }

    const response = await client
      .post(route('AuthController.verifyInvitation'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(400)
    response.assertBody({ message: 'Account already verified' })
  })

  test('organisation invitee cannot verify if token is malformed', async ({ client, route }) => {
    const payload = {
      token: string.generateRandom(32),
      userId: invitedUser.id,
      firstname: 'bob',
      lastname: 'marley',
      password: 'testPassword123!',
      password_confirmation: 'testPassword123!',
    }

    const response = await client
      .post(route('AuthController.verifyInvitation'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(400)
    response.assertBody({ message: 'Unable to verify link. Please contact your administrator' })
  })
})
