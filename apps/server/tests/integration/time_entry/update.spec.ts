import { test } from '@japa/runner'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Task from 'App/Models/Task'
import TimeEntry from 'App/Models/TimeEntry'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'
import { DateTime } from 'luxon'

test.group('Time Entry : Update', (group) => {
  let organisation: Organisation
  let budget: Budget
  let task: Task
  let entry: TimeEntry
  let authUser: User

  group.tap((test) => test.tags(['@time-entry']))

  group.each.setup(async () => {
    organisation = await OrganisationFactory.create()

    const budgets = await BudgetFactory.with('project', 1, (projectBuilder) => {
      projectBuilder.with('client', 1, (clientBuilder) => {
        clientBuilder.merge({ organisationId: organisation.id })
      })
    })
      .with('tasks')
      .with('budgetType')
      .with('billableType')
      .createMany(2)

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    budget = budgets[0]
    task = budget.tasks[0]

    entry = await TimeEntryFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
      taskId: task.id,
      durationMinutes: 500,
      estimatedMinutes: 500,
    })
      .apply('lastStoppedAt')
      .create()
  })

  test('organisation member can update their time entries', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 600,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation manager can update their time entries', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 600,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation org_admin can update their time entries', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 600,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation owner can update their time entries', async ({ client, route }) => {
    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 600,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation admin can update another members time entry', async ({ client, route }) => {
    const memberEntry = await TimeEntryFactory.merge({
      budgetId: budget.id,
      taskId: task.id,
    })
      .with('user', 1, (userBuilder) => {
        userBuilder
          .merge({ organisationId: organisation.id })
          .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      })
      .create()

    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 100,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: memberEntry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation member cannot update another members time entry', async ({
    client,
    route,
  }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const memberEntry = await TimeEntryFactory.merge({
      budgetId: budget.id,
      taskId: task.id,
    })
      .with('user', 1, (userBuilder) => {
        userBuilder
          .merge({ organisationId: organisation.id })
          .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      })
      .create()

    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 100,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: memberEntry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('organisation user cannot set task of another budget to time entry', async ({
    client,
    route,
  }) => {
    const unrelatedTask = await TaskFactory.create()

    const payload = {
      budget_id: budget.id,
      task_id: unrelatedTask.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 1440,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ field: 'task_id', message: 'Task must be related to budget' }],
    })
  })

  test('organsation user cannot exceed the entry duration limit', async ({
    client,
    route,
    assert,
  }) => {
    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 1440,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    assert.isTrue(response.body().duration_minutes === 500)
  })

  test('organsation user cannot exceed the entry estimated duration limit', async ({
    client,
    route,
    assert,
  }) => {
    const payload = {
      budget_id: budget.id,
      task_id: task.id,
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 500,
      estimated_minutes: 1440,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    assert.isTrue(response.body().estimated_minutes === 500)
  })

  test('organisation user cannot update another organisations time entry', async ({
    client,
    route,
  }) => {
    const diffOrgUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const payload = {
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 1440,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .form(payload)
      .loginAs(diffOrgUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('unauthenticated user cannot update time entry', async ({ client, route }) => {
    const payload = {
      date: DateTime.now().minus({ days: 1 }).toISODate(),
      duration_minutes: 1440,
      estimated_minutes: 500,
      description: 'test description',
    }

    const response = await client
      .put(route('TimeEntryController.update', { entryId: entry.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
