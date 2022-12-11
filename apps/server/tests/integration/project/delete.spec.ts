import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Projects: Delete Project', () => {
  test('organisation manager can delete a project', async ({ client, route }) => {
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
      .get(route('ProjectController.delete', { project: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation org_admin can delete a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({ name: 'new-project' })
          })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .get(route('ProjectController.delete', { project: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation owner can delete a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({ name: 'new-project' })
          })
      })
    }).create()

    const response = await client
      .get(route('ProjectController.delete', { project: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation member cannot delete a project', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder
          .merge({ organisationId: clientBuilder.parent.id })
          .with('projects', 1, (projectBuilder) => {
            return projectBuilder.merge({ name: 'new-project' })
          })
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      .create()

    const response = await client
      .get(route('ProjectController.delete', { project: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot delete an organisations project', async ({ client, route }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client
      .get(route('ProjectController.delete', { project: 1 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(404)
    response.assertBody({ message: [{ message: 'Resource not found' }] })
  })

  test('test organisation user cannot delete diff organisations project', async ({
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
      .get(route('ProjectController.view', { project: 2 }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })
})
