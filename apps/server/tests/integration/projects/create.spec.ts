import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Projects: Create Project', () => {
  test('organisation manager can create a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MANAGER }))
      .create()

    const response = await client
      .post(route('ProjectController.create'))
      .form({
        name: 'Test Project',
        client_id: 1,
        show_cost: true,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody({
      id: 1,
      name: 'Test Project',
      private: false,
      show_cost: true,
    })
  })

  test('organisation org admin can create a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .post(route('ProjectController.create'))
      .form({
        name: 'Test Project',
        client_id: 1,
        show_cost: true,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody({
      id: 1,
      name: 'Test Project',
      private: false,
      show_cost: true,
    })
  })

  test('organisation owner can create a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.OWNER }))
      .create()

    const response = await client
      .post(route('ProjectController.create'))
      .form({
        name: 'Test Project',
        client_id: 1,
        show_cost: true,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody({
      id: 1,
      name: 'Test Project',
      private: false,
      show_cost: true,
    })
  })

  test('organisation member cannot create a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      .create()

    const response = await client
      .post(route('ProjectController.create'))
      .form({
        name: 'Test Project',
        client_id: 1,
        show_cost: true,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot create a project', async ({ client, route }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' })
      .with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id })
      })
      .create()

    const response = await client
      .post(route('ProjectController.create'))
      .form({
        name: 'Test Project',
        client_id: 1,
        show_cost: true,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
