import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import { UserFactory } from 'Database/factories'

test.group('Account : Index Accounts', () => {
  test('organisation manager can index accounts', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MANAGER }))
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        firstname: 'Bob',
        lastname: 'Marley',
        initials: 'BM',
        email: 'bob.marley@example.com',
        role: {
          name: UserRole.MEMBER,
        },
      },
    ])
  })

  test('organisation org_admin can index accounts', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.ORG_ADMIN }))
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        firstname: 'Bob',
        lastname: 'Marley',
        initials: 'BM',
        email: 'bob.marley@example.com',
        role: {
          name: UserRole.MEMBER,
        },
      },
    ])
  })

  test('organisation owner can index accounts', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.OWNER }))
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        firstname: 'Bob',
        lastname: 'Marley',
        initials: 'BM',
        email: 'bob.marley@example.com',
        role: {
          name: UserRole.MEMBER,
        },
      },
    ])
  })

  test('organisation admin can filter team members by role', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('users', 2, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.OWNER }))
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        role: UserRole.MEMBER,
      })
      .withCsrfToken()
      .loginAs(authUser)

    assert.isTrue(response.body()?.length === 2)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        firstname: 'Bob',
        lastname: 'Marley',
        initials: 'BM',
        role: {
          name: UserRole.MEMBER,
        },
      },
      {
        id: 2,
        firstname: 'Bob',
        lastname: 'Marley',
        initials: 'BM',
        role: {
          name: UserRole.MEMBER,
        },
      },
    ])
  })

  test('organisation member cannot index accounts', async ({ client, route }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('diff organisation only receives related accounts', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MANAGER }))
      .create()

    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MANAGER }))
      .create()

    const response = await client
      .get(route('AccountController.index'))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    const testOrgAccounts = await authUser.organisation.related('users').query()
    const diffOrgAccounts = await diffUser.organisation.related('users').query()

    assert.notEqual(
      testOrgAccounts.map((account) => account.serialize()),
      diffOrgAccounts.map((account) => account.serialize())
    )

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 3,
        firstname: 'Bob',
        lastname: 'Marley',
        initials: 'BM',
        email: 'bob.marley@example.com',
        role: {
          name: UserRole.MEMBER,
        },
      },
    ])
  })

  test('diff organisation user, cannot view accounts for test organisation', async ({
    client,
    route,
  }) => {
    await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'test-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      .create()

    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' }).with('users', 1, (userBuilder) => {
        return userBuilder
          .merge({
            organisationId: userBuilder.parent.id,
            firstname: 'Bob',
            lastname: 'Marley',
            email: 'bob.marley@example.com',
          })
          .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
      })
    })
      .with('role', 1, (roleBuilder) => roleBuilder.merge({ name: UserRole.MEMBER }))
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
