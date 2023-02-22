import { faker } from '@faker-js/faker'
import { test } from '@japa/runner'
import UserRole from 'App/Enum/UserRole'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'

import { OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Invitation : Create', (group) => {
  let authUser: User
  let organisation: Organisation

  group.each.setup(async () => {
    organisation = await OrganisationFactory.with('users', 5, (userBuilder) => {
      userBuilder.with('role', 1, (roleBuilder) => {
        roleBuilder.apply('member')
      })
    }).create()

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
  })

  test('organisation admin can invite a list of members to the organisation', async ({
    client,
    route,
  }) => {
    const payload = {
      members: [
        {
          email: faker.internet.email(),
          role: UserRole.MEMBER,
        },
        {
          email: faker.internet.email(),
          role: UserRole.ORG_ADMIN,
        },
      ],
    }

    const response = await client
      .post(route('InvitationController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)
  })

  test('organisation invitees receive an invitation email', async ({ client, route, assert }) => {
    const mailer = Mail.fake()

    const payload = {
      members: [
        {
          email: faker.internet.email(),
          role: UserRole.MEMBER,
        },
        {
          email: faker.internet.email(),
          role: UserRole.ORG_ADMIN,
        },
      ],
    }

    const response = await client
      .post(route('InvitationController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .withCsrfToken()
      .loginAs(authUser)

    assert.isTrue(
      mailer.exists((mail) => {
        return mail.subject === 'Join Organisation'
      })
    )

    response.assertStatus(204)

    Mail.restore()
  })

  test('organisation member cannot invite a list of members to the organisation', async ({
    client,
    route,
  }) => {
    // Associate member role to auth user
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .post(route('InvitationController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot invite a list of invitees to the organisation', async ({
    client,
    route,
  }) => {
    const response = await client
      .post(route('InvitationController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
