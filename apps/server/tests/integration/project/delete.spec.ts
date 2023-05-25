import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import { OrganisationFactory, ProjectFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Projects: Delete', (group) => {
  let authUser: User
  let organisation: Organisation
  let project: Project

  group.each.setup(async () => {
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    project = await ProjectFactory.merge({ name: 'new-project' })
      .with('client', 1, (clientBuilder) =>
        clientBuilder.merge({ organisationId: organisation.id })
      )
      .create()

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
  })

  test('organisation manager can delete a project', async ({ client, route }) => {
    // Change authUser role to Manager
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .delete(route('ProjectController.delete', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)
  })

  test('organisation org_admin can delete a project', async ({ client, route }) => {
    // Change authUser role to OrgAdmin
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .delete(route('ProjectController.delete', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)
  })

  test('organisation owner can delete a project', async ({ client, route }) => {
    const response = await client
      .delete(route('ProjectController.delete', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)
  })

  test('organisation member cannot delete a project', async ({ client, route }) => {
    // Change authUser role to member
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .delete(route('ProjectController.delete', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot delete an organisations project', async ({ client, route }) => {
    const response = await client
      .delete(route('ProjectController.delete', { projectId: project.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({ message: [{ message: 'Unauthenticated. Please login.' }] })
  })

  test('organisation user cannot delete another organisations project', async ({
    client,
    route,
  }) => {
    const diffOrg = await OrganisationFactory.merge({ subdomain: 'diff-org' }).create()
    const diffOrgProject = await ProjectFactory.merge({ name: 'new-project' })
      .with('client', 1, (clientBuilder) => clientBuilder.merge({ organisationId: diffOrg.id }))
      .create()

    const response = await client
      .delete(route('ProjectController.view', { projectId: diffOrgProject.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })
})
