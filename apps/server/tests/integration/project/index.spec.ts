import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import { OrganisationFactory, ProjectFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Projects : Index', (group) => {
  let authUser: User
  let organisation: Organisation
  let projects: Project[]

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    // Setup organisation projects
    projects = await ProjectFactory.with('client', 1, (clientBuilder) =>
      clientBuilder.merge({ organisationId: organisation.id })
    ).createMany(5)

    // Setup authUser
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Link authUser to all organisation projects
    await Promise.all(
      projects.map(async (project) => await project.related('members').attach([authUser.id]))
    )
  })

  test('organisation admin can view all organisation projects', async ({ client, route }) => {
    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    const projects = await organisation
      .related('projects')
      .query()
      .preload('budgets')
      .preload('client')
      .preload('members')

    response.assertStatus(200)
    response.assertBodyContains(projects.map((p) => p.serialize()))
  })

  test('organisation member can only view linked projects', async ({ client, route, assert }) => {
    // Set authUser role to MEMBER
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    await projects[0].related('members').detach([authUser.id])

    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.lengthOf(response.body(), 4)
  })

  test('diff organisation user only receives related projects', async ({
    client,
    route,
    assert,
  }) => {
    const diffOrganisation = await OrganisationFactory.merge({ subdomain: 'diff-org' })
      .with('clients', 1, (clientBuilder) => {
        clientBuilder.with('projects', 5)
      })
      .create()
    const diffUser = await UserFactory.merge({ organisationId: diffOrganisation.id })
      .with('role')
      .create()

    const diffOrgProjects = await diffOrganisation
      .related('projects')
      .query()
      .preload('budgets')
      .preload('client')
      .preload('members')

    await Promise.all(
      diffOrgProjects.map(async (project) => await project.related('members').attach([diffUser.id]))
    )

    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    const testOrgProjects = await organisation
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
    response.assertBodyContains(diffOrgProjects.map((p) => p.serialize()))
  })

  test('diff organisation user, cannot view projects for test organisation', async ({
    client,
    route,
  }) => {
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

  test('unauthenticated user cannot view organisations projects', async ({ client, route }) => {
    const response = await client
      .get(route('ProjectController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
