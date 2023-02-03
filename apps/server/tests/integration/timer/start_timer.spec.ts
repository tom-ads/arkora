import { test } from '@japa/runner'
import { CommonTask } from 'App/Enum/CommonTask'
import Organisation from 'App/Models/Organisation'
import TimeEntry from 'App/Models/TimeEntry'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'
import { DateTime } from 'luxon'

test.group('Timers : Start Timer', ({ each }) => {
  let authUser: User
  let timeEntry: TimeEntry
  let organisation: Organisation

  /* 
    Setup
  */
  each.setup(async () => {
    organisation = await OrganisationFactory.create()

    // Setup common organisation tasks
    const commonTasks = await TaskFactory.merge([
      { name: CommonTask.DESIGN },
      { name: CommonTask.DEVELOPMENT },
      { name: CommonTask.DISCOVERY },
    ]).createMany(3)
    await organisation.related('tasks').attach(commonTasks.map((task) => task.id))

    // Setup organisation budget and attach common tasks
    const budget = await BudgetFactory.with('budgetType').create()
    await budget.related('tasks').attach(commonTasks.map((task) => task.id))

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
    await authUser.related('budgets').attach([budget.id])

    // Create time entry that has been previously stopped for auth user
    timeEntry = await TimeEntryFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
      taskId: commonTasks[0].id,
    })
      .apply('lastStoppedAt')
      .create()
  })

  test('organisation member can restart an existing time entry', async ({ client, route }) => {
    // Associate member role to auth user
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .put(route('TimerController.startTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        timer_id: timeEntry.id,
      })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      id: timeEntry.id,
      last_stopped_at: null,
    })
  })

  test('organisation member cannot restart an existing time entry of another organisation team member', async ({
    client,
    route,
  }) => {
    // Associate member role to auth user
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    // Create time entry for diff user
    const diffTimeEntry = await TimeEntryFactory.with('user', 1).apply('lastStoppedAt').create()

    const response = await client
      .put(route('TimerController.startTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        timer_id: diffTimeEntry.id,
      })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('organisation admin can restart an existing time entry of another organisation team member', async ({
    client,
    route,
  }) => {
    // Associate org_admin role to auth user
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    // Create time entry for diff user
    const diffUserTimeEntry = await TimeEntryFactory.with('user', 1, (userBuilder) =>
      userBuilder.merge({ organisationId: organisation.id })
    )
      .apply('lastStoppedAt')
      .create()

    const response = await client
      .put(route('TimerController.startTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        timer_id: diffUserTimeEntry.id,
      })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      id: diffUserTimeEntry.id,
      last_stopped_at: null,
    })
  })

  test('existing timer is stopped and specified time entry is restarted instead', async ({
    client,
    route,
    assert,
  }) => {
    // Associate org_admin role to auth user
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    // Create time entry for diff user
    const diffUser = await UserFactory.merge({ organisationId: organisation.id }).create()

    // Create time entries related to diff user
    const diffUserTimeEntries = await TimeEntryFactory.merge([
      { userId: diffUser.id, lastStoppedAt: null },
      {
        userId: diffUser.id,
        lastStoppedAt: DateTime.now().plus({ minutes: 20 }).set({ millisecond: 0 }),
      },
    ]).createMany(2)

    const response = await client
      .put(route('TimerController.startTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        timer_id: diffUserTimeEntries[1].id,
      })
      .loginAs(authUser)
      .withCsrfToken()

    const diffUserTimer = await diffUser?.getActiveTimer()

    await diffUserTimeEntries[1].refresh()
    assert.notStrictEqual(diffUserTimer?.serialize(), {
      ...diffUserTimeEntries[1].serialize(),
      task: null,
      budget: null,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      id: diffUserTimeEntries[1].id,
      last_stopped_at: null,
    })
  })

  test('diff organisation auth user, cannot start timer from another organisation', async ({
    client,
    route,
  }) => {
    // Associate org_admin role to auth user
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    ).create()

    const response = await client
      .put(route('TimerController.startTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        timer_id: timeEntry.id,
      })
      .loginAs(diffUser)
      .withCsrfToken()

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })

  test('unauthenticated user cannot start a timer', async ({ client, route }) => {
    const response = await client
      .put(route('TimerController.startTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
