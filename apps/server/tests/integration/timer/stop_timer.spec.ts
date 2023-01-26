import { test } from '@japa/runner'
import Organisation from 'App/Models/Organisation'
import TimeEntry from 'App/Models/TimeEntry'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'

test.group('Timers : Stop Timer', ({ each }) => {
  let authUser: User
  let timeEntry: TimeEntry
  let organisation: Organisation

  /*
    Setup
  */
  each.setup(async () => {
    organisation = await OrganisationFactory.create()

    // Setup common organisation task
    const commonTask = await TaskFactory.create()

    // Setup organisation budget and attach common tasks
    const budget = await BudgetFactory.with('budgetType').create()
    await budget.related('tasks').attach([commonTask.id])

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

  test('organisation member can stop their timer', async ({ client, route }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .put(route('TimerController.stopTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(204)
  })

  test('organisation member cannot stop another team members timer', async ({ client, route }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    // Create time entry related different user
    const diffTimeEntry = await TimeEntryFactory.with('user', 1).apply('lastStoppedAt').create()

    const response = await client
      .put(route('TimerController.stopTimer'))
      .form({
        timer_id: diffTimeEntry.id,
      })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('organisation team member without active timer returns 404', async ({ client, route }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)
    await timeEntry.stopTimer()

    const response = await client
      .put(route('TimerController.stopTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(404)
  })

  test('organisation manager can stop another team members timer', async ({ client, route }) => {
    // Change auth user role
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    // Create time entry for diff user
    const diffTimeEntry = await TimeEntryFactory.with('user', 1, (userBuilder) =>
      userBuilder.merge({ organisationId: organisation.id })
    ).create()

    const response = await client
      .put(route('TimerController.stopTimer'))
      .form({ timer_id: diffTimeEntry.id })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(204)
  })

  test('invalid timer_id returns a 422 reponse', async ({ client, route }) => {
    // Change auth user role
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .put(route('TimerController.stopTimer'))
      .form({ timer_id: 1234456890 })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(422)
  })

  test('unauthenticated user cannot stop a timer', async ({ client, route }) => {
    const response = await client
      .put(route('TimerController.stopTimer'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
