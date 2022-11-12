import { test } from '@japa/runner'
import { OrganisationFactory, UserFactory } from 'Database/factories'
import Hash from '@ioc:Adonis/Core/Hash'

const loginRoute = '/auth/login'

test.group('Auth: Login', () => {
  test('user can login to their organisation account', async ({ client }) => {
    Hash.fake()

    const user = await UserFactory.merge({ password: 'newPassword123!' })
      .with('organisation', 1, (builder) => builder.merge({ subdomain: 'test-org' }))
      .create()

    const response = await client
      .post(loginRoute)
      .form({
        email: user.email,
        password: 'newPassword123!',
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })

    response.assertStatus(200)
    response.assertBodyContains({
      user: {},
      organisation: {},
    })

    Hash.restore()
  })

  test('user with invalid credentials receives 400 w/ message', async ({ client }) => {
    Hash.fake()

    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client
      .post(loginRoute)
      .form({
        email: 'doesNotExist@example.com',
        password: 'newPassword123!',
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Email or password is incorrect' })

    Hash.restore()
  })

  test('user from diff organisation, cannot login to organisation', async ({ client }) => {
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
      .post(loginRoute)
      .form({
        email: 'sameemail@example.com',
        password: 'newPassword123!',
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Email or password is incorrect' })

    Hash.restore()
  })

  test('user with same credentials, but diff organisation, cannot login to organisation', async ({
    client,
    assert,
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

    const response = await client
      .post(loginRoute)
      .form({
        email: 'sameemail@example.com',
        password: 'newPassword123!',
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })

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

  test('user login request without Origin header responds with bad request', async ({ client }) => {
    const response = await client.post(loginRoute).form({
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    })

    response.assertStatus(404)
    response.assertBody({ message: 'Origin header not present' })
  })

  test('auth user gets forbidden route when trying to hit login route', async ({ client }) => {
    const user = await UserFactory.merge({
      email: 'sameemail@example.com',
      password: 'newPassword123!',
    })
      .with('organisation', 1, (builder) => builder.merge({ subdomain: 'test-org' }))
      .create()

    const response = await client
      .post(loginRoute)
      .form({
        email: user.email,
        password: user.password,
      })
      .loginAs(user)

    response.assertStatus(403)
  })
})
