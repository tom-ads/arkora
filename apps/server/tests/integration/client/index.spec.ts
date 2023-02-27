import { test } from '@japa/runner'
import User from 'App/Models/User'
import { RoleFactory, UserFactory } from 'Database/factories'

test.group('Clients : Index', ({ each }) => {
  let authUser: User

  each.setup(async () => {
    authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role')
      .create()
  })

  test('organisation manager can index clients', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        name: 'Bobs Burger',
      },
    ])
  })

  test('organisation org_admin can index clients', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        name: 'Bobs Burger',
      },
    ])
  })

  test('organisation owner can index clients', async ({ client, route }) => {
    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        name: 'Bobs Burger',
      },
    ])
  })

  test('organisation member cannot index clients', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot index clients', async ({ client, route }) => {
    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('diff organisation only receives related clients', async ({ client, route, assert }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    const testOrgClients = await authUser.organisation.related('clients').query()
    const diffOrgClients = await diffUser.organisation.related('clients').query()

    assert.notEqual(
      testOrgClients.map((client) => client.serialize()),
      diffOrgClients.map((client) => client.serialize())
    )

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 2,
        name: 'Bobs Burger',
      },
    ])
  })

  test('diff organisation user, cannot view clients for test organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })
})
