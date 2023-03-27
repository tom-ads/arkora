import { test } from '@japa/runner'
import { CommonTask } from 'App/Enum/DefaultTask'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Task from 'App/Models/Task'
import { OrganisationFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'

test.group('Task: All Tasks', ({ each }) => {
  let organisation: Organisation
  let commonTasks: Task[]
  let budgets: Budget[]
  let budgetTask: Task

  /* 
    Setup
  */

  each.setup(async () => {
    organisation = await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      return clientBuilder.with('projects', 2, (projectBuilder) => {
        return projectBuilder
          .merge([{ name: 'project-1' }, { name: 'project-2' }])
          .with('budgets', 2, (budgetQuery) => budgetQuery.with('budgetType'))
      })
    }).create()

    // Setup common organisation tasks
    commonTasks = await TaskFactory.merge([
      { name: CommonTask.DESIGN },
      { name: CommonTask.DEVELOPMENT },
      { name: CommonTask.DISCOVERY },
    ]).createMany(3)
    await organisation.related('tasks').attach(commonTasks.map((task) => task.id))

    // Setup budget only task
    budgetTask = await TaskFactory.merge({ name: 'BudgetTask' }).create()

    // Preload projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    budgets = organisation.projects.map((project) => project.budgets).flat()

    // Link tasks to budgets
    await Promise.all([
      budgets.map((budget) => budget.related('tasks').attach([budgetTask.id])),
      budgets.map((budget) => budget.related('tasks').attach(commonTasks.map((task) => task.id))),
    ])
  })

  /* 
    Tests
  */

  test('unauthorized user cannot view an organisations tasks', async ({ client, route }) => {
    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('organisation member can index organisation tasks', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('member')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map((budget) => budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.deepEqual(
      response.body(),
      commonTasks.map((task) => task.serialize())
    )
  })

  test('organisation manager can index organisation tasks', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('manager')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map((budget) => budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.deepEqual(
      response.body(),
      commonTasks.map((task) => task.serialize())
    )
  })

  test('organisation org_admin can index organisation tasks', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('orgAdmin')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map((budget) => budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.deepEqual(
      response.body(),
      commonTasks.map((task) => task.serialize())
    )
  })

  test('organisation owner can index organisation tasks', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('role').create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map((budget) => budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.deepEqual(
      response.body(),
      commonTasks.map((task) => task.serialize())
    )
  })

  test('organisation member can index related budget tasks', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('member')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map((budget) => budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .qs({ budget_id: budgets[0].id })
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.deepEqual(
      response.body(),
      commonTasks.concat(budgetTask).map((task) => task.serialize())
    )
  })

  test('organisation member cannot index tasks for an unrelated budget', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('member')
    ).create()

    // Only link the organisation, and not budgets
    await Promise.all([authUser.related('organisation').associate(organisation)])

    const response = await client
      .get(route('TaskController.index'))
      .qs({ budget_id: budgets[0].id })
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('diff organisation user, cannot index tasks for another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const response = await client
      .get(route('TaskController.index'))
      .qs({ budget_id: budgets[0].id })
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })
})
