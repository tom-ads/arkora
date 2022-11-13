import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

const projectsRoute = '/projects'

test.group('Projects: All Projects', () => {
  test('authenticated user can view organisations projects', async ({ client }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('clients', 1, (builder) => {
        return builder.with('projects', 2)
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(projectsRoute)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    const projects = await authUser.organisation.related('projects').query()

    response.assertStatus(200)
    response.assertBody({ projects: projects.map((p) => p.serialize()) })
  })

  test('unauthenticated user cannot view organisations projects', async ({ client }) => {
    const response = await client
      .get(projectsRoute)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('user from diff organisation, cannot view test organisation projects', async ({
    client,
    assert,
  }) => {
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
      .get(projectsRoute)
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    const testOrgProjects = await authUser.organisation.related('projects').query()
    const diffOrgProjects = await diffUser.organisation.related('projects').query()

    assert.notEqual(
      diffOrgProjects.map((p) => p.serialize()),
      testOrgProjects.map((p) => p.serialize())
    )

    response.assertStatus(200)
    response.assertBody({ projects: diffOrgProjects.map((p) => p.serialize()) })
  })
})