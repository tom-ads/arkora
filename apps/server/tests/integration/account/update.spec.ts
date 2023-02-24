import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Accounts : Update', (group) => {
  let authUser: User
  let organisation: Organisation

  group.each.setup(async () => {
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
  })

  test('organisation admin can update another organisation member', async ({ client, route }) => {
    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: orgMember.role.name,
    }

    const response = await client
      .put(route('AccountController.update', { userId: orgMember.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await orgMember.refresh()

    response.assertStatus(200)
    response.assertBodyContains({
      ...orgMember.serialize(),
      ...payload,
      role: { name: payload.role },
    })
  })

  test('organisation user can update their own information', async ({ client, route }) => {
    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: orgMember.role.name,
    }

    const response = await client
      .put(route('AccountController.update', { userId: orgMember.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(orgMember)

    await orgMember.refresh()

    response.assertStatus(200)
    response.assertBodyContains({
      ...orgMember.serialize(),
      ...payload,
      role: { name: UserRole.MEMBER },
    })
  })

  test('organisation member cannot elevate their role', async ({ client, route }) => {
    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: UserRole.ORG_ADMIN,
    }

    const response = await client
      .put(route('AccountController.update', { userId: orgMember.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(orgMember)

    await orgMember.refresh()

    response.assertStatus(200)
    response.assertBodyContains({
      ...orgMember.serialize(),
      ...payload,
      role: { name: UserRole.MEMBER },
    })
  })

  test('organisation member cannot elevate another users role', async ({ client, route }) => {
    // Update authUser role to be MEMBER
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: UserRole.ORG_ADMIN,
    }

    const response = await client
      .put(route('AccountController.update', { userId: orgMember.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await orgMember.refresh()

    response.assertStatus(403)
  })

  test('organisation manager cannot elevate their role', async ({ client, route }) => {
    const orgManager = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('manager'))
      .create()

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: UserRole.ORG_ADMIN,
    }

    const response = await client
      .put(route('AccountController.update', { userId: orgManager.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(orgManager)

    await orgManager.refresh()

    response.assertStatus(200)
    response.assertBodyContains({
      ...orgManager.serialize(),
      ...payload,
      role: { name: UserRole.MANAGER },
    })
  })

  test('organisation manager cannot elevate another users role', async ({ client, route }) => {
    // Update authUser role to be MANAGER
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const orgMember = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: UserRole.ORG_ADMIN,
    }

    const response = await client
      .put(route('AccountController.update', { userId: orgMember.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    await orgMember.refresh()

    response.assertStatus(200)
    response.assertBodyContains({
      ...orgMember.serialize(),
      ...payload,
      role: { name: UserRole.MEMBER },
    })
  })

  test('organisation user cannot update another organisation users information', async ({
    client,
    route,
  }) => {
    const diffOrgUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const payload = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: UserRole.MEMBER,
    }

    const response = await client
      .put(route('AccountController.update', { userId: authUser.id }))
      .form(payload)
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffOrgUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot update their information', async ({ client, route }) => {
    const response = await client
      .put(route('AccountController.update', { userId: authUser.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
