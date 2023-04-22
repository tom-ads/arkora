import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Budget Tasks : Index', (group) => {
  let organisation: Organisation
  let authUser: User
  let budget: Budget

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.create()

    // Setup organisation client, project and budget
    budget = await BudgetFactory.with('project', 1, (projectBuilder) =>
      projectBuilder.with('client', 1, (clientBuilder) =>
        clientBuilder.merge({ organisationId: organisation.id })
      )
    )
      .with('tasks', 3, (taskBuilder) =>
        taskBuilder
          .mergeRecursive({ budget })
          .merge([
            { name: DefaultTask.DESIGN },
            { name: DefaultTask.DEVELOPMENT },
            { name: DefaultTask.DISCOVERY },
          ])
      )
      .with('budgetType')
      .with('billableType')
      .create()

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    await budget.related('members').attach([authUser.id])
  })

  /* 
    organisation user unassigned to budget, cannot retrieve budget tasks
    organisation user cannot index another organisations budget tasks
  */

  test('organisation member can index assigned budget tasks', async ({ client, route }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('BudgetTaskController.index', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    const budgetTasks = await budget.related('tasks').query()

    response.assertStatus(200)
    response.assertBodyContains(budgetTasks.map((task) => task.serialize()))
  })

  test('organisation manager can index assigned budget tasks', async ({ client, route }) => {
    // Change auth user role
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .get(route('BudgetTaskController.index', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    const budgetTasks = await budget.related('tasks').query()

    response.assertStatus(200)
    response.assertBodyContains(budgetTasks.map((task) => task.serialize()))
  })

  test('organisation org_admin can index assigned budget tasks', async ({ client, route }) => {
    // Change auth user role
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .get(route('BudgetTaskController.index', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    const budgetTasks = await budget.related('tasks').query()

    response.assertStatus(200)
    response.assertBodyContains(budgetTasks.map((task) => task.serialize()))
  })

  test('organisation owner can index assigned budget tasks', async ({ client, route }) => {
    const response = await client
      .get(route('BudgetTaskController.index', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    const budgetTasks = await budget.related('tasks').query()

    response.assertStatus(200)
    response.assertBodyContains(budgetTasks.map((task) => task.serialize()))
  })

  test('organisation user unassigned to budget, cannot retrieve budget tasks', async ({
    client,
    route,
  }) => {
    await budget.related('members').detach([authUser.id])

    const response = await client
      .get(route('BudgetTaskController.index', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('organisation user cannot retrieve budget tasks from another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('BudgetTaskController.index', { budgetId: budget.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .loginAs(diffUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('unauthenticated user cannot retrieve budget tasks', async ({ client, route }) => {
    const response = await client
      .get(route('BudgetTaskController.index', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .send()

    response.assertStatus(401)
  })
})
