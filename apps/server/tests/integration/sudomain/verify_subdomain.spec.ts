import { test } from '@japa/runner'
import { staticAppHostname } from 'Config/app'
import { OrganisationFactory } from 'Database/factories'

test.group('Verify Subdomain', () => {
  test('valid organisation subdomain should be verified', async ({ client }) => {
    OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const origin = `http://test-org.${staticAppHostname}`
    const response = await client.get('/subdomain').headers({ origin })

    response.assertStatus(200)
  })

  test('invalid organisation should not be verified', async ({ client }) => {
    OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const origin = `http://diff-org.${staticAppHostname}`
    const response = await client.get('/subdomain').headers({ origin })

    response.assertStatus(404)
    response.assertBody({ message: 'No organisation found' })
  })

  test('origin without a subdomain should not be verified', async ({ client }) => {
    OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const origin = `http://${staticAppHostname}`
    const response = await client.get('/subdomain').headers({ origin })

    response.assertStatus(404)
    response.assertBody({ message: 'No subdomain found' })
  })
})
