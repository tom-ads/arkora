import { test } from '@japa/runner'
import Status from 'App/Enum/Status'
import UserRole from 'App/Enum/UserRole'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Project: Update Project', () => {
  test('organisation manager can update a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({
              name: 'new-project',
              showCost: true,
              private: true,
            })
          })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MANAGER }))
      .create()

    const response = await client
      .put(route('ProjectController.update', { projectId: 1 }))
      .form({
        name: 'updated-name',
        show_cost: false,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('organisation org_admin can update a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({
              name: 'new-project',
              showCost: true,
              private: true,
            })
          })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .put(route('ProjectController.update', { projectId: 1 }))
      .form({
        name: 'updated-name',
        show_cost: false,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('organisation owner can update a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({
              name: 'new-project',
              showCost: true,
              private: true,
            })
          })
      })
    })
      .with('role')
      .create()

    const response = await client
      .put(route('ProjectController.update', { projectId: 1 }))
      .form({
        name: 'updated-name',
        show_cost: false,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('organisation member cannot update a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({
              name: 'new-project',
              showCost: true,
              private: true,
            })
          })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .put(route('ProjectController.update', { projectId: 1 }))
      .form({
        name: 'updated-name',
        show_cost: false,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('unauthenticated organiation user cannot update a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({
              name: 'new-project',
              showCost: true,
              private: true,
            })
          })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .put(route('ProjectController.update', { projectId: 1 }))
      .form({
        name: 'updated-name',
        show_cost: false,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('test organisation user cannot update diff organisations project', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({
              name: 'new-project',
              showCost: true,
              private: true,
            })
          })
      })
    })
      .with('role')
      .create()

    await OrganisationFactory.merge({ subdomain: 'diff-org' })
      .with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id }).with('projects', 1)
      })
      .create()

    const response = await client
      .put(route('ProjectController.update', { projectId: 2 }))
      .form({
        name: 'updated-name',
        show_cost: false,
        private: false,
        team: [],
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })
})
