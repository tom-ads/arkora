import { test } from '@japa/runner'
import { CommonTask } from 'App/Enum/CommonTask'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Task from 'App/Models/Task'
import TimeEntry from 'App/Models/TimeEntry'
import User from 'App/Models/User'
import { OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'

test.group('Time Entry : Delete', ({ each }) => {
  let organisation: Organisation
  let commonTasks: Task[]
  let budgets: Budget[]
  let authUser: User

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

    // Preload projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    const projects = organisation.projects
    budgets = organisation.projects.map((project) => project.budgets).flat()

    // Link tasks to budgets
    await Promise.all(
      budgets.map(
        async (budget) => await budget.related('tasks').attach(commonTasks.map((task) => task.id))
      )
    )

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Link authUser to projects and budgets
    await Promise.all([
      ...projects.map(async (project) => await project.related('members').attach([authUser.id])),
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])
  })

  /* 
    TESTS
  */

  test('organisation user can delete their time entry', async ({ client, route, assert }) => {
    const budget = budgets[0]

    const entry = await TimeEntryFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
    })
      .apply('lastStoppedAt')
      .create()

    const response = await client
      .delete(route('TimeEntryController.delete', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(204)

    const entries = await TimeEntry.all()
    assert.lengthOf(entries, 0)
  })

  test('organisation member cannot delete another members time entry', async ({
    client,
    route,
  }) => {
    const budget = budgets[0]

    const orgUser = await UserFactory.merge({ organisationId: organisation.id })
      .with('role')
      .create()

    const entry = await TimeEntryFactory.merge({
      userId: orgUser.id,
      budgetId: budget.id,
    })
      .apply('lastStoppedAt')
      .create()

    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .delete(route('TimeEntryController.delete', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation user cannot delete time entry from user in another organisation', async ({
    client,
    route,
  }) => {
    const budget = budgets[0]

    const diffOrgUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const entry = await TimeEntryFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
    })
      .apply('lastStoppedAt')
      .create()

    const response = await client
      .delete(route('TimeEntryController.delete', { entryId: entry.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffOrgUser)

    response.assertStatus(403)
  })

  test('unauthenticated user cannot delete time entry', async ({ client, route }) => {
    const budget = budgets[0]
    const entry = await TimeEntryFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
    })
      .apply('lastStoppedAt')
      .create()

    const response = await client
      .delete(route('TimeEntryController.delete', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
