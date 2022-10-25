import { test } from '@japa/runner'
import { OrganisationFactory } from 'Database/factories'

test.group('Verify Subdomain', () => {
  test('valid organisation subdomain should be verified', async ({ client }) => {
    OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client.get('/subdomain/test-org')

    response.assertStatus(200)
  })

  test('invalid organisation should not be verified', async ({ client }) => {
    OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client.get('/subdomain/diff-org')

    response.assertStatus(404)
    response.assertBody({ message: 'No organisation found' })
  })
})
