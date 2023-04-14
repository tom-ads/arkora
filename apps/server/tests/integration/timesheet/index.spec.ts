import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import Organisation from 'App/Models/Organisation'
import TimeEntry from 'App/Models/TimeEntry'
import User from 'App/Models/User'
import { OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'
import { getDatesBetweenPeriod } from 'Helpers/date'
import { getTimeEntriesTotalMinutes } from 'Helpers/timer'
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'

test.group('Timesheet : Index', ({ each }) => {
  let organisation: Organisation
  let timesheet: TimeEntry[]
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
    const commonTasks = await TaskFactory.merge([
      { name: DefaultTask.DESIGN },
      { name: DefaultTask.DEVELOPMENT },
      { name: DefaultTask.DISCOVERY },
    ]).createMany(3)
    await organisation.related('commonTasks').createMany(
      commonTasks.map((task) => ({
        name: task.name,
        isBillable: task.isBillable,
      }))
    )

    // Preload projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    // Link tasks to budgets
    const budgets = organisation.projects.map((project) => project.budgets).flat()
    await Promise.all(
      budgets.map(
        async (budget) =>
          await budget.related('tasks').createMany(
            commonTasks.map((task) => ({
              name: task.name,
              isBillable: task.isBillable,
            }))
          )
      )
    )

    // Generate timesheet across previous week
    timesheet = await TimeEntryFactory.merge([
      { date: DateTime.now().minus({ week: 1 }).startOf('week') },
      { date: DateTime.now().minus({ week: 1 }).startOf('week').plus({ days: 1 }) },
      { date: DateTime.now().minus({ week: 1 }).startOf('week').plus({ days: 2 }) },
      { date: DateTime.now().minus({ week: 1 }).startOf('week').plus({ days: 3 }) },
    ])
      .apply('lastStoppedAt')
      .createMany(4)

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
    await Promise.all(
      timesheet.map(async (entry) => await entry.related('user').associate(authUser))
    )
  })

  test('organisation member can index a timesheet for a specific week', async ({
    client,
    route,
    assert,
  }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs({
        start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
        end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        (e) => e.user_id
      ),
      response.body()
    )
  })

  test('organisation manager can index a timesheet for a specific week', async ({
    client,
    route,
    assert,
  }) => {
    // Change auth user role
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs({
        start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
        end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        (e) => e.user_id
      ),
      response.body()
    )
  })

  test('organisation org_admin can index a timesheet for a specific week', async ({
    client,
    route,
    assert,
  }) => {
    // Change auth user role
    const orgAdmin = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdmin)

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs({
        start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
        end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        (e) => e.user_id
      ),
      response.body()
    )
  })

  test('organisation owner can index a timesheet for a specific week', async ({
    client,
    route,
    assert,
  }) => {
    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs({
        start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
        end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    assert.notStrictEqual(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        (e) => e.user_id
      ),
      response.body()
    )
  })

  test('organisation cannot index timesheets from another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })

  test('organisation index time entries throws a 422 when passed an invalid payload', async ({
    client,
    route,
  }) => {
    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(422)
    response.assertBody({
      errors: [
        { field: 'start_date', message: 'Start date is required', rule: 'required' },
        { field: 'end_date', message: 'End date is required', rule: 'required' },
      ],
    })
  })

  test('unauthorized user cannot index time entries', async ({ client, route }) => {
    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
