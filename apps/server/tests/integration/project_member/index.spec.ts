import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import { OrganisationFactory, ProjectFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Project Member : Index', (group) => {
  let authUser: User
  let organisation: Organisation
  let project: Project

  group.tap((test) => test.tags(['@project-members']))

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.create()

    // Setup organisation project
    project = await ProjectFactory.with('client', 1, (clientBuilder) => {
      clientBuilder.merge({ organisationId: organisation.id })
    }).create()

    // Setup authUser
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Assign authUser to project
    await project.related('members').attach([authUser.id])
  })

  test('organisation member can index project members', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)
    await authUser.load('role')

    const response = await client
      .get(route('ProjectMemberController.index', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([authUser.serialize()])
  })

  test('organisation manager can index project members', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)
    await authUser.load('role')

    const response = await client
      .get(route('ProjectMemberController.index', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([authUser.serialize()])
  })

  test('organisation org_admin can index project members', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)
    await authUser.load('role')

    const response = await client
      .get(route('ProjectMemberController.index', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([authUser.serialize()])
  })

  test('organisation owner can index project members', async ({ client, route }) => {
    const response = await client
      .get(route('ProjectMemberController.index', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([authUser.serialize()])
  })

  test('unauthenticated user cannot index project members', async ({ client, route }) => {
    const response = await client
      .get(route('ProjectMemberController.index', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
