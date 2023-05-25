import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Account : Index', (group) => {
  let authUser: User
  let organisation: Organisation

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
    }).create()

    // Setup auth user
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
  })

  test('organisation manager can index accounts', async ({ client, route }) => {
    // Change authUser role to Manager
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    const orgMembers = await organisation.related('users').query()

    response.assertStatus(200)
    response.assertBodyContains(orgMembers.map((member) => member.serialize()))
  })

  test('organisation org_admin can index accounts', async ({ client, route }) => {
    // Change authUser role to OrgAdmin
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    const orgMembers = await organisation.related('users').query()

    response.assertStatus(200)
    response.assertBodyContains(orgMembers.map((member) => member.serialize()))
  })

  test('organisation owner can index accounts', async ({ client, route }) => {
    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    const orgMembers = await organisation.related('users').query()

    response.assertStatus(200)
    response.assertBodyContains(orgMembers.map((member) => member.serialize()))
  })

  test('organisation admin can filter team members by role', async ({ client, route, assert }) => {
    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .qs({ role: UserRole.MEMBER })
      .withCsrfToken()
      .loginAs(authUser)

    const orgMembers = await organisation.related('users').query()

    response.assertStatus(200)
    response.assertBodyContains(
      orgMembers
        .filter((member) => member?.role?.name !== UserRole.OWNER)
        .map((member) => member.serialize())
    )

    assert.isTrue(response.body()?.length === 5)
  })

  test('organisation member cannot index accounts', async ({ client, route }) => {
    // Change authUser role to member
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation admin cannot index another organisations members', async ({
    client,
    route,
    assert,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    const testOrgAccounts = await organisation.related('users').query()
    const diffOrgAccounts = await diffUser.organisation.related('users').query()

    assert.notEqual(
      testOrgAccounts.map((account) => account.serialize()),
      diffOrgAccounts.map((account) => account.serialize())
    )

    response.assertStatus(200)
    response.assertBodyContains(diffOrgAccounts.map((member) => member.serialize()))
  })

  test('diff organisation user, cannot view accounts for test organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })
})
