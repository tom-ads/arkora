import { test } from '@japa/runner'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Auth : Session', () => {
  test('authenticated user can retrieve their session', async ({ client, route, assert }) => {
    const organisation = await OrganisationFactory.create()
    const authUser = await UserFactory.merge({ organisationId: organisation.id })
      .with('role')
      .create()

    const response = await client
      .get(route('AuthController.session'))
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    assert.notStrictEqual(response.body(), {
      user: authUser.serialize(),
      organisation: {
        ...organisation.serialize(),
        currency: null,
        common_tasks: [],
        business_days: [],
      },
    })
  })

  test('unauthenticated user receives unauthenticated response', async ({ client, route }) => {
    const response = await client.get(route('AuthController.session')).withCsrfToken()
    response.assertStatus(401)
  })
})
