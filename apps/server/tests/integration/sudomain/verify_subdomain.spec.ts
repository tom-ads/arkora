import { test } from '@japa/runner'
import { OrganisationFactory } from 'Database/factories'

test.group('Subdomain : Verify', () => {
  test('valid organisation subdomain should be verified', async ({ client, route }) => {
    const organisation = await OrganisationFactory.merge({ subdomain: 'test-org' })
      .with('currency')
      .with('workDays')
      .create()

    const response = await client
      .get(route('SubdomainController.checkSubdomain'))
      .qs({ subdomain: 'test-org' })
      .withCsrfToken()

    await organisation.refresh()

    response.assertStatus(200)
    response.assertBodyContains({
      exists: true,
      organisation: {
        ...organisation.serialize(),
      },
    })
  })

  test('invalid organisation subdomain should not be verified', async ({ client, route }) => {
    await OrganisationFactory.merge({ subdomain: 'test-org' }).create()

    const response = await client
      .get(route('SubdomainController.checkSubdomain'))
      .qs({ subdomain: 'diff-org' })
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBody({
      exists: false,
    })
  })
})
