import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import Budget from 'App/Models/Budget'
import CommonTask from 'App/Models/CommonTask'
import Organisation from 'App/Models/Organisation'
import { OrganisationFactory, UserFactory } from 'Database/factories'
import CommonTaskFactory from 'Database/factories/CommonTaskFactory'

test.group('Tasks : Index', ({ each }) => {
  let organisation: Organisation
  let commonTasks: CommonTask[]
  let budgets: Budget[]

  /* 
    Setup
  */

  each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      return clientBuilder.with('projects', 2, (projectBuilder) => {
        return projectBuilder
          .merge([{ name: 'project-1' }, { name: 'project-2' }])
          .with('budgets', 2, (budgetQuery) => budgetQuery.with('budgetType'))
      })
    }).create()

    // Setup default organisation tasks
    commonTasks = await CommonTaskFactory.mergeRecursive({ organisationId: organisation.id })
      .merge([
        { name: DefaultTask.DESIGN },
        { name: DefaultTask.DEVELOPMENT },
        { name: DefaultTask.DISCOVERY },
      ])
      .createMany(3)

    // Preload projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    budgets = organisation.projects.map((project) => project.budgets).flat()

    // Link tasks to budgets
    await Promise.all([
      ...budgets.map(
        async (budget) =>
          await budget.related('tasks').create({ name: 'BudgetTask', isBillable: false })
      ),
      ...budgets.map(
        async (budget) =>
          await budget.related('tasks').createMany(
            commonTasks.map((task) => ({
              name: task.name,
              isBillable: task.isBillable,
            }))
          )
      ),
    ])
  })

  /* 
    Tests
  */

  test('organisation member can index organisation tasks', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('member')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
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
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
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
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
      response.body(),
      commonTasks.map((task) => task.serialize())
    )
  })

  test('organisation owner can index organisation tasks', async ({ client, route, assert }) => {
    const authUser = await UserFactory.with('role').create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
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
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('TaskController.index'))
      .qs({ budget_id: budgets[0].id })
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    // assert.notStrictEqual(
    //   response.body(),
    //   commonTasks.concat(budgetTask).map((task) => task.serialize())
    // )
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

  test('unauthorized user cannot view an organisations tasks', async ({ client, route }) => {
    const response = await client
      .get(route('TaskController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
