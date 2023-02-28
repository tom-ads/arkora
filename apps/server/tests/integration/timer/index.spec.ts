import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import TimeEntry from 'App/Models/TimeEntry'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'

test.group('Timers: Index Timers', ({ each }) => {
  let authUser: User
  let timeEntry: TimeEntry
  let organisation: Organisation

  /* 
    Setup
  */

  each.setup(async () => {
    organisation = await OrganisationFactory.create()

    // Setup common organisation tasks
    const commonTask = await TaskFactory.create()

    // Setup organisation budget and attach common tasks
    const budget = await BudgetFactory.with('budgetType').create()
    await budget.related('tasks').attach([commonTask.id])

    // Create organisation members with active timers
    await UserFactory.merge({ organisationId: organisation.id })
      .with('timeEntries', 1, (entryBuilder) =>
        entryBuilder.merge({ budgetId: budget.id, taskId: commonTask.id })
      )
      .createMany(2)

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
    await authUser.related('budgets').attach([budget.id])

    // Create time entry that has been previously stopped for auth user
    timeEntry = await TimeEntryFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
      taskId: commonTask.id,
    }).create()
  })

  test('organisation manager can index a list of timers', async ({ client, route, assert }) => {
    // Associate member role to auth user
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .get(route('TimerController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    assert.lengthOf(response.body(), 2)

    response.assertStatus(200)
    response.assertBodyContains([{ timer: { last_stopped_at: null } }])
  })

  test('organisation admin can index a list of timers', async ({ client, route, assert }) => {
    // Associate member role to auth user
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .get(route('TimerController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    assert.lengthOf(response.body(), 2)

    response.assertStatus(200)
    response.assertBodyContains([{ timer: { last_stopped_at: null } }])
  })

  test('organisation owner can index a list of timers', async ({ client, route, assert }) => {
    const response = await client
      .get(route('TimerController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    assert.lengthOf(response.body(), 2)

    response.assertStatus(200)
    response.assertBodyContains([{ timer: { last_stopped_at: null } }])
  })

  test('organisation member cannot index a list of timers', async ({ client, route }) => {
    // Associate member role to auth user
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('TimerController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('returns active and inactive organisation timers', async ({ client, route, assert }) => {
    await timeEntry?.stopTimer()

    const response = await client
      .get(route('TimerController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    assert.lengthOf(response.body(), 2)
    assert.notContainsSubset(response.body(), { timer: { last_stopped_at: null } })

    response.assertStatus(200)
    response.assertBodyContains([{ timer: { last_stopped_at: null } }])
  })

  test('unauthorized user cannot index organisation timers', async ({ client, route }) => {
    const response = await client
      .post(route('TimerController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
