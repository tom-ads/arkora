import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import CommonTask from 'App/Models/CommonTask'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import {
  BudgetTypeFactory,
  OrganisationFactory,
  RoleFactory,
  UserFactory,
} from 'Database/factories'
import BillableTypeFactory from 'Database/factories/BillableTypeFactory'
import CommonTaskFactory from 'Database/factories/CommonTaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'
import { union } from 'lodash'
import { stringify } from 'qs'

test.group('Time Entries : Index', ({ each }) => {
  let organisation: Organisation
  let authUser: User
  let projects: Project[]
  let commonTasks: CommonTask[]

  each.setup(async () => {
    const budgetType = await BudgetTypeFactory.apply('variable').create()
    const billableType = await BillableTypeFactory.apply('total_cost').create()

    organisation = await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      return clientBuilder.with('projects', 2, (projectBuilder) => {
        return projectBuilder
          .merge([{ name: 'project-1' }, { name: 'project-2' }])
          .with('budgets', 2, (budgetQuery) =>
            budgetQuery.merge({
              billableTypeId: billableType.id,
              budgetTypeId: budgetType.id,
              budget: 10000000, // £100,000
              hourlyRate: 10000, // £100
            })
          )
      })
    }).create()

    // Setup common tasks
    commonTasks = await CommonTaskFactory.mergeRecursive({ organisation: organisation.id })
      .merge([
        { name: DefaultTask.DESIGN },
        { name: DefaultTask.DEVELOPMENT },
        { name: DefaultTask.DISCOVERY },
      ])
      .createMany(3)

    // Prelod projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    projects = organisation.projects
    const budgets = projects.map((project) => project.budgets).flat()

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Associate authUser to relations
    await Promise.all([
      ...projects.map(async (project) => await project.related('members').attach([authUser.id])),
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
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

    await TimeEntryFactory.merge({
      budgetId: projects[0].budgets[0].id,
      userId: authUser.id,
      taskId: commonTasks[0].id,
    }).createMany(5)
    await TimeEntryFactory.merge({
      budgetId: projects[0].budgets[1].id,
      userId: authUser.id,
      taskId: commonTasks[1].id,
    }).createMany(5)
  })

  test('organisation user can filter entries by project', async ({ client, route, assert }) => {
    const project = projects[0]

    const response = await client
      .get(route('TimeEntryController.index'))
      .qs({ project_id: project.id })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 10)

    assert.notStrictEqual(
      project.budgets.map((budget) => budget.id),
      union(response.body().map((entry) => entry.budget_id))
    )
  })

  test('organisation user can filter entries by task', async ({ client, route, assert }) => {
    const task = commonTasks[1]

    const response = await client
      .get(route('TimeEntryController.index'))
      .qs(stringify({ tasks: [task.id] }, { arrayFormat: 'brackets', encode: false }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 5)

    response.assertBodyContains([{ task_id: task.id }])
  })

  test('organisation user can filter entries by userId', async ({ client, route, assert }) => {
    const response = await client
      .get(route('TimeEntryController.index'))
      .qs(stringify({ members: [authUser.id] }, { arrayFormat: 'brackets', encode: false }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 10)

    response.assertBodyContains([{ user_id: authUser.id }])
  })

  test('organisation user can filter entries by budgetId', async ({ client, route, assert }) => {
    const budget = projects[0].budgets[0]

    const response = await client
      .get(route('TimeEntryController.index'))
      .qs(stringify({ budgets: [budget.id] }, { arrayFormat: 'brackets', encode: false }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 5)

    response.assertBodyContains([{ budget_id: budget.id }])
  })

  test('organisation member can filter entries by billable', async ({ client, route, assert }) => {
    const response = await client
      .get(route('TimeEntryController.index'))
      .qs({ billable: 'billable' })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 0)
  })

  test('organisation member can filter entries by unbillable', async ({
    client,
    route,
    assert,
  }) => {
    const response = await client
      .get(route('TimeEntryController.index'))
      .qs({ billable: 'unbillable' })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 10)
  })

  test('organisation member can only filter entries by their user_id', async ({
    client,
    route,
    assert,
  }) => {
    const diffOrgUser = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (builder) => builder.apply('manager'))
      .create()

    // Associate member role to auth user
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('TimeEntryController.index'))
      .qs({ user_id: diffOrgUser.id })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 10)

    response.assertBodyContains([{ user_id: authUser.id }])
  })

  test('organisation user cannot index another organisations time entries', async ({
    client,
    route,
    assert,
  }) => {
    const diffOrgUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const response = await client
      .get(route('TimeEntryController.index'))
      .qs({ user_id: authUser.id })
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffOrgUser)

    response.assertStatus(200)

    assert.lengthOf(response.body(), 0)
  })

  test('unauthenticated user cannot index organisation time entries', async ({ client, route }) => {
    const response = await client
      .get(route('TimeEntryController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
