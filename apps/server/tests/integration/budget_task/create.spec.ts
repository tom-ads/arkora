import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'

test.group('Budget Tasks : Create', (group) => {
  let organisation: Organisation
  let authUser: User
  let budget: Budget

  group.tap((test) => test.tags(['@budget-tasks']))

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.create()

    // Setup organisation client, project and budget
    budget = await BudgetFactory.with('project', 1, (projectBuilder) =>
      projectBuilder.with('client', 1, (clientBuilder) =>
        clientBuilder.merge({ organisationId: organisation.id })
      )
    )
      .with('budgetType')
      .with('billableType')
      .create()

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Assign authUser to project and budget member
    const project = await budget.related('project').query().first()
    await Promise.all([
      project!.related('members').attach([authUser.id]),
      budget.related('members').attach([authUser.id]),
    ])
  })

  test('organisation manager can create a budget task', async ({ client, route }) => {
    // Change auth user role
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const payload = {
      name: DefaultTask.DESIGN,
      is_billable: true,
    }

    const response = await client
      .post(route('BudgetTaskController.create', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation org_admin can create a budget task', async ({ client, route }) => {
    // Change auth user role
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const payload = {
      name: DefaultTask.DESIGN,
      is_billable: true,
    }

    const response = await client
      .post(route('BudgetTaskController.create', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation owner can create a budget task', async ({ client, route }) => {
    const payload = {
      name: DefaultTask.DESIGN,
      is_billable: true,
    }

    const response = await client
      .post(route('BudgetTaskController.create', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation member cannot create budget task', async ({ client, route }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      name: DefaultTask.DESIGN,
      is_billable: true,
    }

    const response = await client
      .post(route('BudgetTaskController.create', { budgetId: budget.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('organisation admin cannot create a budget task with an existing name', async ({
    client,
    route,
  }) => {
    await TaskFactory.merge({ budgetId: budget.id, name: DefaultTask.DESIGN }).create()

    const payload = {
      name: DefaultTask.DESIGN,
      is_billable: true,
    }

    const response = await client
      .post(route('BudgetTaskController.create', { budgetId: budget.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ field: 'name', message: 'Name already taken' }],
    })
  })

  test('organisation user cannot create a budget task for another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const payload = {
      name: DefaultTask.DESIGN,
      is_billable: true,
    }

    const response = await client
      .post(route('BudgetTaskController.create', { budgetId: budget.id }))
      .form(payload)
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .loginAs(diffUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('unauthenticated user cannot retrieve budget tasks', async ({ client, route }) => {
    const payload = {
      name: DefaultTask.DESIGN,
      is_billable: true,
    }

    const response = await client
      .post(route('BudgetTaskController.create', { budgetId: budget.id }))
      .form(payload)
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .send()

    response.assertStatus(401)
  })
})
