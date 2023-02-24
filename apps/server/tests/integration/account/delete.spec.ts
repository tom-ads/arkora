import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Accounts : Delete', (group) => {
  let authUser: User
  let orgUser: User
  let organisation: Organisation

  group.each.setup(async () => {
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    orgUser = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()
  })

  test('organisation admin can delete another organisation user', async ({
    client,
    route,
    assert,
  }) => {
    const response = await client
      .delete(route('AccountController.delete', { userId: orgUser.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)

    const deletedUser = await User.find(orgUser.id)
    assert.equal(deletedUser, null)
  })

  test('organisation user cannot delete themselves', async ({ client, route }) => {
    const response = await client
      .delete(route('AccountController.delete', { userId: authUser.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation member cannot delete another organisation user', async ({ client, route }) => {
    const response = await client
      .delete(route('AccountController.delete', { userId: authUser.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(orgUser)

    response.assertStatus(403)
  })

  test('organisation user cannot delete another organisations users information', async ({
    client,
    route,
  }) => {
    const diffOrgUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const response = await client
      .delete(route('AccountController.delete', { userId: authUser.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffOrgUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot delete organisation users', async ({ client, route }) => {
    const response = await client
      .delete(route('AccountController.delete', { userId: authUser.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
