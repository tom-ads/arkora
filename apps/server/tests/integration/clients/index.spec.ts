import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import { OrganisationFactory, UserFactory } from 'Database/factories'

/* 
  Organisation manager can view all clients
  organisation org_admin can view all clients
  organisation owner can view all clients
  organisation member cannot view all clients 
*/
test.group('Clients: All Clients', () => {
  test('organisation manager can index clients', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MANAGER }))
      .create()

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody([
      {
        id: 1,
        name: 'Bobs Burger',
      },
    ])
  })

  test('organisation org_admin can index clients', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody([
      {
        id: 1,
        name: 'Bobs Burger',
      },
    ])
  })

  test('organisation owner can index clients', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.OWNER }))
      .create()

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody([
      {
        id: 1,
        name: 'Bobs Burger',
      },
    ])
  })

  test('organisation member cannot index clients', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      .create()

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot index clients', async ({ client, route }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' })
      .with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({
          organisationId: clientBuilder.parent.id,
          name: 'Bob Burgers',
        })
      })
      .create()

    const response = await client
      .get(route('ClientController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('diff organisation only receives related clients', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role')
      .create()

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
    response.assertBody([{ id: 2, name: 'Bobs Burger' }])
  })

  test('diff organisation user, cannot view clients for test organisation', async ({
    client,
    route,
  }) => {
    await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role')
      .create()

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
