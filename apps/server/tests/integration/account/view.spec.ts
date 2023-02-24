import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Accounts : View', (group) => {
  let authUser: User
  let organisation: Organisation

  group.each.setup(async () => {
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
  })

  test('organisation member can view themselves', async ({ client, route }) => {
    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const response = await client
      .get(route('AccountController.view', { userId: orgMember.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(orgMember)

    response.assertStatus(200)
    response.assertBodyContains(orgMember.serialize())
  })

  test('organisation admin can view organisation member', async ({ client, route }) => {
    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const response = await client
      .get(route('AccountController.view', { userId: orgMember.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains(orgMember.serialize())
  })

  test('unauthenticated user cannot view organisation users', async ({ client, route }) => {
    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const response = await client
      .get(route('AccountController.view', { userId: orgMember.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
