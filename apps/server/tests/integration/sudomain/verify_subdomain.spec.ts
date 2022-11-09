import { test } from '@japa/runner'
import { OrganisationFactory } from 'Database/factories'

test.group('Verify Subdomain', () => {
  test('valid organisation subdomain should be verified', async ({ client }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client.get('/subdomain?subdomain=test-org')

    response.assertStatus(200)
    response.assertBody({
      exists: true,
    })
  })

  test('invalid organisation subdomain should not be verified', async ({ client }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client.get('/subdomain?subdomain=diff-org')

    response.assertStatus(200)
    response.assertBody({
      exists: false,
    })
  })
})
