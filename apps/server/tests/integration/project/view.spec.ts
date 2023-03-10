import { test } from '@japa/runner'
import Status from 'App/Enum/Status'
import UserRole from 'App/Enum/UserRole'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Project: View Project', () => {
  test('organisation manager can view a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({ name: 'new-project' })
          })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MANAGER }))
      .create()

    const response = await client
      .get(route('ProjectController.view', { projectId: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'new-project',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('organisation org_admin can view a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 1, (projectBuilder) => {
          projectBuilder.merge({ name: 'new-project' })
        })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .get(route('ProjectController.view', { projectId: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'new-project',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('organisation owner can view a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 1, (projectBuilder) => {
          projectBuilder.merge({ name: 'new-project' })
        })
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ProjectController.view', { projectId: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      name: 'new-project',
      private: false,
      show_cost: false,
      status: Status.ACTIVE,
    })
  })

  test('organisation member cannot view a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 1, (projectBuilder) => {
          projectBuilder.merge({ name: 'new-project' })
        })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      .create()

    const response = await client
      .get(route('ProjectController.view', { projectId: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot view a project', async ({ client, route }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' })
      .with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id }).with('projects', 1)
      })
      .create()

    const response = await client
      .get(route('ProjectController.view', { projectId: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('diff organisation auth user, cannot view a project from test organisation', async ({
    client,
    route,
  }) => {
    await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            projectBuilder.merge({ name: 'new-project' })
          })
      })
    })
      .with('role')
      .create()

    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 1, (projectBuilder) => {
          projectBuilder.merge({ name: 'new-project' })
        })
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ProjectController.view', { projectId: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })

  test('test organisation user cannot view diff organisations project', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            projectBuilder.merge({ name: 'new-project' })
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
      .get(route('ProjectController.view', { projectId: 2 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })
})
