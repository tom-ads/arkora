import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import { OrganisationFactory, ProjectFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Projects : View', (group) => {
  let authUser: User
  let organisation: Organisation
  let project: Project

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    // Setup organisation project
    project = await ProjectFactory.with('client', 1, (clientBuilder) =>
      clientBuilder.merge({ name: 'test-project', organisationId: organisation.id })
    ).create()

    // Setup authUser
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Link authUser to organisation project
    await project.related('members').attach([authUser.id])
  })

  test('organisation manager can view a project', async ({ client, route }) => {
    // Set authUser role to MANAGER
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .get(route('ProjectController.view', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await project.load('members')
    await project.load('client')

    response.assertStatus(200)
    response.assertBodyContains(project.serialize())
  })

  test('organisation org_admin can view a project', async ({ client, route }) => {
    // Set authUser role to ORG_ADMIN
    const orgRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgRole)

    const response = await client
      .get(route('ProjectController.view', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await project.load('members')
    await project.load('client')

    response.assertStatus(200)
    response.assertBodyContains(project.serialize())
  })

  test('organisation owner can view a project', async ({ client, route }) => {
    const response = await client
      .get(route('ProjectController.view', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await project.load('members')
    await project.load('client')

    response.assertStatus(200)
    response.assertBodyContains(project.serialize())
  })

  test('organisation member can view a project', async ({ client, route }) => {
    // Set authUser role to MEMBER
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('ProjectController.view', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await project.load('client')

    response.assertStatus(200)
    response.assertBodyContains(project.serialize())
  })

  test('unauthenticated user cannot view a project', async ({ client, route }) => {
    const response = await client
      .get(route('ProjectController.view', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('diff organisation auth user, cannot view a project from test organisation', async ({
    client,
    route,
  }) => {
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
      .get(route('ProjectController.view', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })

  test('organisation user cannot view diff organisations project', async ({ client, route }) => {
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
