import { test } from '@japa/runner'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Auth : Session', (group) => {
  group.tap((test) => test.tags(['@auth']))

  test('authenticated user can retrieve their session', async ({ client, route, assert }) => {
    const organisation = await OrganisationFactory.create()
    const authUser = await UserFactory.merge({ organisationId: organisation.id })
      .with('role')
      .create()

    const response = await client
      .get(route('AuthController.session'))
      .headers({ Origin: 'http://test-org.arkora.co.uk' })
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

  test('authenticated user not requesting from their organisation, receives 401', async ({
    client,
    route,
  }) => {
    const organisation = await OrganisationFactory.create()
    const authUser = await UserFactory.merge({ organisationId: organisation.id })
      .with('role')
      .create()

    const response = await client
      .get(route('AuthController.session'))
      .headers({ Origin: 'http://arkora.co.uk' })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('unauthenticated user receives unauthenticated response', async ({ client, route }) => {
    const response = await client.get(route('AuthController.session')).withCsrfToken()
    response.assertStatus(401)
  })
})
