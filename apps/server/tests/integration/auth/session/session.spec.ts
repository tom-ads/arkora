import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

const sessionRoute = '/auth/session'

test.group('Auth: Session', () => {
  test('authenticated user can pull their session', async ({ client }) => {
    const authUser = await UserFactory.with('organisation', 1, (builder) =>
      builder.merge({ subdomain: 'test-org' }).with('currency').with('workDays')
    )
      .with('role')
      .create()

    const response = await client.get(sessionRoute).loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      user: authUser.serialize(),
      organisation: authUser.organisation.serialize(),
    })
  })

  test('unauthenticated user receives unauthenticed when trying to pull session', async ({
    client,
  }) => {
    const response = await client.get(sessionRoute)

    response.assertStatus(401)
  })
})
