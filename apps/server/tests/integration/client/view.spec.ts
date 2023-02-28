import { test } from '@japa/runner'
import Client from 'App/Models/Client'
import User from 'App/Models/User'
import { ClientFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Clients : View', ({ each }) => {
  let authUser: User
  let orgClient: Client

  each.setup(async () => {
    const organisation = await OrganisationFactory.create()

    orgClient = await ClientFactory.merge({
      organisationId: organisation.id,
      name: 'Bobs Burger',
    }).create()

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
  })

  test('organisation manager can index a client', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .get(route('ClientController.view', { clientId: orgClient.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'Bobs Burger' })
  })

  test('organisation org_admin can index a client', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .get(route('ClientController.view', { clientId: orgClient.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'Bobs Burger' })
  })

  test('organisation owner can index a client', async ({ client, route }) => {
    const response = await client
      .get(route('ClientController.view', { clientId: orgClient.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({ name: 'Bobs Burger' })
  })

  test('organisation member cannot index a client', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('ClientController.view', { clientId: orgClient.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot index clients', async ({ client, route }) => {
    const response = await client
      .get(route('ClientController.view', { clientId: orgClient.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('organisation user cannot view another organisations client', async ({ client, route }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ClientController.view', { clientId: orgClient.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(403)
  })
})
