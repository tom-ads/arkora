import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

/*
  TestRouteProvder injects the test-subdomain route when
  tests are executed.
*/
test.group('ValidateSubdomain Middleware', () => {
  test('organisation with linked authenticed user', async ({ client }) => {
    const authUser = await UserFactory.with('organisation', 1, (builder) => {
      builder.merge({ subdomain: 'test-org' })
    }).create()

    const response = await client
      .get('/test-subdomain')
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('user with different organisation cannot pass middleware', async ({ client }) => {
    const authUser = await UserFactory.with('organisation', 1, (builder) => {
      builder.merge({ subdomain: 'test-org' })
    }).create()

    const response = await client
      .get('/test-subdomain')
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .loginAs(authUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })

  test('unauthenticated user cannot pass middleware', async ({ client }) => {
    const response = await client.get('/test-subdomain')

    response.assertStatus(401)
    response.assertBody({ message: 'Unauthenticated' })
  })
})
