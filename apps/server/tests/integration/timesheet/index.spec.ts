import { test } from '@japa/runner'
import { CommonTask } from 'App/Enum/CommonTask'
import Organisation from 'App/Models/Organisation'
import TimeEntry from 'App/Models/TimeEntry'
import { OrganisationFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'

test.group('Timesheet: All Time Entries', ({ each }) => {
  let organisation: Organisation
  let timesheet: TimeEntry[]

  /* 
    Setup
  */

  each.setup(async () => {
    organisation = await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      return clientBuilder.with('projects', 2, (projectBuilder) => {
        return projectBuilder
          .merge([{ name: 'project-1' }, { name: 'project-2' }])
          .with('budgets', 2)
      })
    }).create()

    // Setup common organisation tasks
    const commonTasks = await TaskFactory.merge([
      { name: CommonTask.DESIGN },
      { name: CommonTask.DEVELOPMENT },
      { name: CommonTask.DISCOVERY },
    ]).createMany(3)
    await organisation.related('tasks').attach(commonTasks.map((task) => task.id))

    // Preload projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    // Link tasks to budgets
    const budgets = organisation.projects.map((project) => project.budgets).flat()
    await Promise.all(
      budgets.map((budget) => budget.related('tasks').attach(commonTasks.map((task) => task.id)))
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
  })

  test('organisation member can index a timesheet for a specific week', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('member')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      timesheet.map(async (entry) => await entry.related('user').associate(authUser)),
    ])

    const params = {
      start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
      end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
    }

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs(params)
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        'date'
      )
    )
  })

  test('organisation manager can index a timesheet for a specific week', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('manager')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      timesheet.map(async (entry) => await entry.related('user').associate(authUser)),
    ])

    const params = {
      start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
      end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
    }

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs(params)
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        'date'
      )
    )
  })

  test('organisation org_admin can index a timesheet for a specific week', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('orgAdmin')
    ).create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      timesheet.map(async (entry) => await entry.related('user').associate(authUser)),
    ])

    const params = {
      start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
      end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
    }

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs(params)
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        'date'
      )
    )
  })

  test('organisation owner can index a timesheet for a specific week', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('role').create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      timesheet.map(async (entry) => await entry.related('user').associate(authUser)),
    ])

    const params = {
      start_date: DateTime.now().minus({ week: 1 }).startOf('week').toISODate(),
      end_date: DateTime.now().minus({ week: 1 }).endOf('week').toISODate(),
    }

    const response = await client
      .get(route('TimesheetController.index'))
      .headers({ origin: 'http://test-org.arkora.co.uk' })
      .qs(params)
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody(
      groupBy(
        timesheet.map((entry) => entry.serialize()),
        'date'
      )
    )
  })

  test('organisation cannot index timesheets from another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
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
    const authUser = await UserFactory.with('role').create()

    await Promise.all([
      authUser.related('organisation').associate(organisation),
      timesheet.map(async (entry) => await entry.related('user').associate(authUser)),
    ])

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
