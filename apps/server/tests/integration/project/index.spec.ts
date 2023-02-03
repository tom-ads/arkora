import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Projects: All Projects', () => {
  test('authenticated user can view organisations projects', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 2, (projectBuilder) => {
          return projectBuilder
            .with('members', 5)
            .with('budgets', 5, (budgetQuery) => budgetQuery.with('budgetType'))
        })
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    const projects = await authUser.organisation
      .related('projects')
      .query()
      .preload('budgets')
      .preload('client')
      .preload('members')

    response.assertStatus(200)
    response.assertBody({ projects: projects.map((p) => p.serialize()) })
  })

  test('unauthenticated user cannot view organisations projects', async ({ client, route }) => {
    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('diff organisation only receives related projects', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 2)
      })
    })
      .with('role')
      .create()

    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 2)
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    const testOrgProjects = await authUser.organisation
      .related('projects')
      .query()
      .preload('budgets')
      .preload('client')
      .preload('members')
    const diffOrgProjects = await diffUser.organisation
      .related('projects')
      .query()
      .preload('budgets')
      .preload('client')
      .preload('members')

    assert.notEqual(
      diffOrgProjects.map((p) => p.serialize()),
      testOrgProjects.map((p) => p.serialize())
    )

    response.assertStatus(200)
    response.assertBody({ projects: diffOrgProjects.map((p) => p.serialize()) })
  })

  test('diff organisation user, cannot view projects for test organisation', async ({
    client,
    route,
  }) => {
    await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 2)
      })
    })
      .with('role')
      .create()

    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 2)
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })
})
