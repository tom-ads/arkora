import { test } from '@japa/runner'
import Client from 'App/Models/Client'
import User from 'App/Models/User'
import { ClientFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Clients : Update', ({ each }) => {
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

  test('organisation org_admin can update a client', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const payload = {
      name: 'Konahu',
    }

    const response = await client
      .put(route('ClientController.update', { clientId: orgClient.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation owner can update a client', async ({ client, route }) => {
    const payload = {
      name: 'Konahu',
    }

    const response = await client
      .put(route('ClientController.update', { clientId: orgClient.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation manager cannot update a client', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const payload = {
      name: 'Konahu',
    }

    const response = await client
      .put(route('ClientController.update', { clientId: orgClient.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation member cannot update a client', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      name: 'Konahu',
    }

    const response = await client
      .put(route('ClientController.update', { clientId: orgClient.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot update a client', async ({ client, route }) => {
    const response = await client
      .put(route('ClientController.update', { clientId: orgClient.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('organisation user cannot update another organisations client', async ({
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

    const payload = {
      name: 'Konahu',
    }

    const response = await client
      .put(route('ClientController.update', { clientId: orgClient.id }))
      .form(payload)
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(403)
  })
})
