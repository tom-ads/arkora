import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import { OrganisationFactory, ProjectFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Project Member : Delete', (group) => {
  let authUser: User
  let organisation: Organisation
  let project: Project
  let projectMembers: User[]

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    // Setup authUser
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Setup client and project
    project = await ProjectFactory.merge({ name: 'new-project' })
      .with('client', 1, (clientBuilder) =>
        clientBuilder.merge({ organisationId: organisation.id })
      )
      .create()

    // Setup project members
    projectMembers = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .createMany(10)
    await project
      .related('members')
      .attach([authUser.id, ...projectMembers.map((member) => member.id)])
  })

  test('organisation manager can remove a member from a project', async ({
    client,
    route,
    assert,
  }) => {
    const member = projectMembers[0]

    // Update authUser role to be MANAGER
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .delete(
        route('ProjectMemberController.delete', {
          projectId: project.id,
          memberId: member.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)

    const projectMember = await project
      .related('members')
      .query()
      .where('user_id', member.id)
      .first()

    assert.isTrue(!projectMember)
  })

  test('organisation org_admin can remove a member from a project', async ({
    client,
    route,
    assert,
  }) => {
    const member = projectMembers[0]

    // Update authUser role to be ORG_ADMIN
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .delete(
        route('ProjectMemberController.delete', {
          projectId: project.id,
          memberId: member.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)

    const projectMember = await project
      .related('members')
      .query()
      .where('user_id', member.id)
      .first()
    assert.isTrue(!projectMember)
  })

  test('organisation owner can remove a member from a project', async ({
    client,
    route,
    assert,
  }) => {
    const member = projectMembers[0]

    const response = await client
      .delete(
        route('ProjectMemberController.delete', {
          projectId: project.id,
          memberId: member.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)

    const projectMember = await project
      .related('members')
      .query()
      .where('user_id', member.id)
      .first()
    assert.isTrue(!projectMember)
  })

  test('organisation member cannot remove a member from a project', async ({ client, route }) => {
    const member = projectMembers[0]

    // Update authUser role to be MEMBER
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .delete(
        route('ProjectMemberController.delete', {
          projectId: project.id,
          memberId: member.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot delete a project member', async ({ client, route }) => {
    const member = projectMembers[0]

    const response = await client
      .delete(
        route('ProjectMemberController.delete', {
          projectId: project.id,
          memberId: member.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('organisation user cannot delete another organisations project member', async ({
    client,
    route,
  }) => {
    const member = projectMembers[0]
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id, name: 'Bobs Burger' })
      })
    })
      .with('role')
      .create()

    const response = await client
      .delete(
        route('ProjectMemberController.delete', {
          projectId: project.id,
          memberId: member.id,
        })
      )
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(403)
  })
})
