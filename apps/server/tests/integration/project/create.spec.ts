import { test } from '@japa/runner'
import Status from 'App/Enum/Status'
import User from 'App/Models/User'
import { ProjectFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Projects : Create', (group) => {
  let authUser: User

  group.tap((test) => test.tags(['@projects']))

  group.each.setup(async () => {
    authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id })
      })
    })
      .with('role')
      .create()
  })

  test('organisation manager can create a project', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const payload = {
      name: 'Test Project',
      client_id: 1,
      show_cost: true,
      private: false,
      status: Status.ACTIVE,
    }

    const response = await client
      .post(route('ProjectController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBody({
      id: 1,
      name: 'Test Project',
      private: false,
      show_cost: true,
      status: Status.ACTIVE,
    })
  })

  test('organisation org_admin can create a project', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const payload = {
      name: 'Test Project',
      client_id: 1,
      show_cost: true,
      private: false,
      status: Status.ACTIVE,
    }

    const response = await client
      .post(route('ProjectController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBody({
      id: 1,
      name: 'Test Project',
      private: false,
      show_cost: true,
      status: Status.ACTIVE,
    })
  })

  test('organisation owner can create a project', async ({ client, route }) => {
    const payload = {
      name: 'Test Project',
      client_id: 1,
      show_cost: true,
      private: false,
      status: Status.ACTIVE,
    }

    const response = await client
      .post(route('ProjectController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBody({
      id: 1,
      name: 'Test Project',
      private: false,
      show_cost: true,
      status: Status.ACTIVE,
    })
  })

  test('organisation member cannot create a project', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      name: 'Test Project',
      client_id: 1,
      show_cost: true,
      private: false,
      status: Status.ACTIVE,
    }

    const response = await client
      .post(route('ProjectController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('user cannot create a project with the name of an existing project', async ({
    client,
    route,
  }) => {
    await ProjectFactory.merge({ clientId: 1, name: 'test-project' }).create()

    const payload = {
      name: 'test-project',
      client_id: 1,
      show_cost: true,
      private: false,
      status: Status.ACTIVE,
    }

    const response = await client
      .post(route('ProjectController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(422)
    response.assertBody({ errors: [{ field: 'name', message: 'Name already taken' }] })
  })

  test('organisation cannot create a project for another organisation', async ({
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
      name: 'test-project',
      client_id: 1,
      show_cost: true,
      private: false,
      status: Status.ACTIVE,
    }

    const response = await client
      .post(route('ProjectController.create'))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .form(payload)
      .loginAs(diffUser)
      .withCsrfToken()

    // Organisation client not related
    response.assertStatus(422)
  })

  test('unauthenticated user cannot create a project', async ({ client, route }) => {
    const payload = {
      name: 'test-project',
      client_id: 1,
      show_cost: true,
      private: false,
      status: Status.ACTIVE,
    }

    const response = await client
      .post(route('ProjectController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .withCsrfToken()

    response.assertStatus(401)
  })
})
