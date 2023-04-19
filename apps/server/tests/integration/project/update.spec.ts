import { test } from '@japa/runner'
import Client from 'App/Models/Client'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import { OrganisationFactory, ProjectFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Projects : Update', (group) => {
  let authUser: User
  let project: Project
  let organisation: Organisation

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    // Setup organisation projects
    project = await ProjectFactory.merge({ name: 'test-project' })
      .with('client', 1, (clientBuilder) =>
        clientBuilder.merge({ organisationId: organisation.id })
      )
      .create()

    await organisation.load('clients')

    // Setup authUser
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Link authUser to all organisation projects
    await project.related('members').attach([authUser.id])
  })

  test('organisation manager can update a project', async ({ client, route }) => {
    // Set authUser role to MANAGER
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const payload = {
      name: 'updated-name',
      show_cost: false,
      private: false,
      client_id: organisation.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: project.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      client: organisation.clients[0].serialize(),
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: 'ACTIVE',
    })
  })

  test('organisation org_admin can update a project', async ({ client, route }) => {
    // Set authUser role to ORG_ADMIN
    const orgRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgRole)

    const payload = {
      name: 'updated-name',
      show_cost: false,
      private: false,
      client_id: organisation.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: project.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      client: organisation.clients[0].serialize(),
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: 'ACTIVE',
    })
  })

  test('organisation owner can update a project', async ({ client, route }) => {
    const payload = {
      name: 'updated-name',
      show_cost: false,
      private: false,
      client_id: organisation.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: 1 }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      client: organisation.clients[0].serialize(),
      name: 'updated-name',
      private: false,
      show_cost: false,
      status: 'ACTIVE',
    })
  })

  test('organisation member cannot update a project', async ({ client, route }) => {
    // Set authUser role to MEMBER
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      name: 'updated-name',
      show_cost: false,
      private: false,
      client_id: organisation.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: project.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('returns 422, when updating an organisations project with a name that already exists', async ({
    client,
    route,
  }) => {
    const projectClient = await Client.query().first()
    await ProjectFactory.merge({ clientId: projectClient!.id, name: 'project-conflict' }).create()

    const payload = {
      name: 'project-conflict',
      show_cost: false,
      private: false,
      client_id: organisation.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: project.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(422)
    response.assertBody({
      errors: [{ field: 'name', message: 'Name already taken' }],
    })
  })

  test('returns 200, when updating an organisations project with the same name', async ({
    client,
    route,
  }) => {
    const payload = {
      name: 'test-project',
      show_cost: false,
      private: false,
      client_id: organisation.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: project.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await project.refresh()
    await project.load('client')

    response.assertStatus(200)
    response.assertBody(project.serialize())
  })

  test('unauthenticated user cannot update a project', async ({ client, route }) => {
    const payload = {
      name: 'updated-name',
      show_cost: false,
      private: false,
      client_id: organisation.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: project.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('organisation user cannot update diff organisations project', async ({ client, route }) => {
    const diffOrg = await OrganisationFactory.merge({ subdomain: 'diff-org' })
      .with('clients', 1, (clientBuilder) => {
        return clientBuilder.merge({ organisationId: clientBuilder.parent.id }).with('projects', 1)
      })
      .create()

    const payload = {
      name: 'updated-name',
      show_cost: false,
      private: false,
      client_id: diffOrg.clients[0].id,
    }

    const response = await client
      .put(route('ProjectController.update', { projectId: 2 }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })
})
