import { test } from '@japa/runner'
import { OrganisationFactory, UserFactory } from 'Database/factories'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('Auth: Login', () => {
  test('user can login to their organisation account', async ({ client, route }) => {
    Hash.fake()

    const user = await UserFactory.merge({ password: 'newPassword123!' })
      .with('organisation', 1, (builder) => builder.merge({ subdomain: 'test-org' }))
      .create()

    const payload = {
      email: user.email,
      password: 'newPassword123!',
    }

    const response = await client
      .post(route('AuthController.login'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      user: {},
      organisation: {},
    })

    Hash.restore()
  })

  test('user with invalid credentials receives 400', async ({ client, route }) => {
    Hash.fake()

    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const payload = {
      email: 'doesNotExist@example.com',
      password: 'newPassword123!',
    }

    const response = await client
      .post(route('AuthController.login'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Email or password is incorrect' })

    Hash.restore()
  })

  test('user from diff organisation, cannot login to organisation', async ({ client, route }) => {
    Hash.fake()

    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    // Diff org
    await UserFactory.merge({
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    })
      .with('organisation', 1, (builder) => builder.merge({ subdomain: 'diff-org' }))
      .create()

    const response = await client
      .post(route('AuthController.login'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        email: 'sameemail@example.com',
        password: 'newPassword123!',
      })
      .withCsrfToken()

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Email or password is incorrect' })

    Hash.restore()
  })

  test('user with same credentials, but diff organisation, cannot login to organisation', async ({
    client,
    assert,
    route,
  }) => {
    Hash.fake()

    const user = await UserFactory.merge({
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    })
      .with('organisation', 1, (builder) => builder.merge({ subdomain: 'test-org' }))
      .create()

    const diffOrgUser = await UserFactory.merge({
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    })
      .with('organisation', 1, (builder) => builder.merge({ subdomain: 'diff-org' }))
      .create()

    const payload = {
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    }

    const response = await client
      .post(route('AuthController.login'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
      },
      organisation: {
        subdomain: 'test-org',
      },
    })

    assert.notEqual(response.body, diffOrgUser.serialize())

    Hash.restore()
  })

  test('user login request without Origin header responds with bad request', async ({
    client,
    route,
  }) => {
    const payload = {
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    }

    const response = await client.post(route('AuthController.login')).form(payload).withCsrfToken()

    response.assertStatus(404)
    response.assertBody({ message: 'Origin header not present' })
  })

  test('auth user gets forbidden route when trying to hit login route', async ({
    client,
    route,
  }) => {
    const user = await UserFactory.merge({
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    })
      .with('organisation', 1, (builder) => builder.merge({ subdomain: 'test-org' }))
      .create()

    const payload = {
      email: user.email,
      password: user.password,
    }

    const response = await client
      .post(route('AuthController.login'))
      .form(payload)
      .loginAs(user)
      .withCsrfToken()

    response.assertStatus(403)
  })
})
