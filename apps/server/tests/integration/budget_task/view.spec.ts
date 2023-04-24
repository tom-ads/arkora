import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Task from 'App/Models/Task'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'

test.group('Budget Tasks : View', (group) => {
  let organisation: Organisation
  let authUser: User
  let budget: Budget
  let budgetTasks: Task[]

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

    // Setup budget tasks
    budgetTasks = await TaskFactory.mergeRecursive({ budgetId: budget.id, isBillable: false })
      .merge([
        { name: DefaultTask.DESIGN },
        { name: DefaultTask.DEVELOPMENT },
        { name: DefaultTask.DISCOVERY },
      ])
      .createMany(3)

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Assign authUser to project and budget member
    const project = await budget.related('project').query().first()
    await Promise.all([
      project!.related('members').attach([authUser.id]),
      budget.related('members').attach([authUser.id]),
    ])
  })

  test('organisation member can view a budget task', async ({ client, route }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const budgetTask = budgetTasks[0]

    const response = await client
      .get(route('BudgetTaskController.view', { budgetId: budget.id, taskId: budgetTask.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(200)
    response.assertBodyContains({
      name: budgetTask.name,
      is_billable: budgetTask.isBillable,
    })
  })

  test('organisation manager can view a budget task', async ({ client, route }) => {
    // Change auth user role
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const budgetTask = budgetTasks[0]

    const response = await client
      .get(route('BudgetTaskController.view', { budgetId: budget.id, taskId: budgetTask.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(200)
    response.assertBodyContains({
      name: budgetTask.name,
      is_billable: budgetTask.isBillable,
    })
  })

  test('organisation org_admin can view a budget task', async ({ client, route }) => {
    // Change auth user role
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const budgetTask = budgetTasks[0]

    const response = await client
      .get(route('BudgetTaskController.view', { budgetId: budget.id, taskId: budgetTask.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(200)
    response.assertBodyContains({
      name: budgetTask.name,
      is_billable: budgetTask.isBillable,
    })
  })

  test('organisation owner can create a budget task', async ({ client, route }) => {
    const budgetTask = budgetTasks[0]

    const response = await client
      .get(route('BudgetTaskController.view', { budgetId: budget.id, taskId: budgetTask.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(200)
    response.assertBodyContains({
      name: budgetTask.name,
      is_billable: budgetTask.isBillable,
    })
  })

  test('organisation user cannot view a budget task for another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const budgetTask = budgetTasks[0]

    const response = await client
      .get(route('BudgetTaskController.view', { budgetId: budget.id, taskId: budgetTask.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .loginAs(diffUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('unauthenticated user cannot retrieve a budget task', async ({ client, route }) => {
    const budgetTask = budgetTasks[0]

    const response = await client
      .get(route('BudgetTaskController.view', { budgetId: budget.id, taskId: budgetTask.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .send()

    response.assertStatus(401)
  })
})
