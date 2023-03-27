import { test } from '@japa/runner'
import { CommonTask } from 'App/Enum/DefaultTask'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Task from 'App/Models/Task'
import { OrganisationFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'
import { DateTime } from 'luxon'

test.group('Timer : Create', ({ each }) => {
  let organisation: Organisation
  let commonTasks: Task[]
  let budgets: Budget[]

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

    budgets = organisation.projects.map((project) => project.budgets).flat()

    // Link tasks to budgets
    await Promise.all(
      budgets.map(
        async (budget) => await budget.related('tasks').attach(commonTasks.map((task) => task.id))
      )
    )
  })

  /* 
    TESTS
  */

  test('organisation member can create a new time entry', async ({ client, route }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) => {
      roleBuilder.apply('member')
    }).create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const payload = {
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        ...payload,
        date: DateTime.now().toISO(),
        budget_id: budgets[0]?.id,
        task_id: commonTasks?.find((task) => task.name === CommonTask.DEVELOPMENT)?.id,
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      ...payload,
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation manager can create a new time entry', async ({ client, route }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) => {
      roleBuilder.apply('manager')
    }).create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const payload = {
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        ...payload,
        date: DateTime.now().toISO(),
        budget_id: budgets[0]?.id,
        task_id: commonTasks?.find((task) => task.name === CommonTask.DEVELOPMENT)?.id,
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      ...payload,
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation org_admin can create a new time entry', async ({ client, route }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) => {
      roleBuilder.apply('orgAdmin')
    }).create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const payload = {
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        ...payload,
        date: DateTime.now().toISO(),
        budget_id: budgets[0]?.id,
        task_id: commonTasks?.find((task) => task.name === CommonTask.DEVELOPMENT)?.id,
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      ...payload,
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation owner can create a new time entry', async ({ client, route }) => {
    const authUser = await UserFactory.with('role').create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const payload = {
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        ...payload,
        date: DateTime.now().toISO(),
        budget_id: budgets[0]?.id,
        task_id: commonTasks?.find((task) => task.name === CommonTask.DEVELOPMENT)?.id,
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      ...payload,
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation user cannot create time entry on unrelated budget', async ({
    client,
    route,
  }) => {
    const authUser = await UserFactory.with('role').create()
    authUser.related('organisation').associate(organisation)

    const payload = {
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        ...payload,
        date: DateTime.now().toISO(),
        budget_id: budgets[0]?.id,
        task_id: commonTasks?.find((task) => task.name === CommonTask.DEVELOPMENT)?.id,
      })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('active timer is stopped before creating a new organisation time entry for auth user', async ({
    client,
    route,
    assert,
  }) => {
    const authUser = await UserFactory.with('role').create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const activeEntry = await TimeEntryFactory.merge({
      durationMinutes: 20,
      lastStartedAt: DateTime.now().minus({ minutes: 20 }),
    }).create()
    await activeEntry.related('user').associate(authUser)

    const payload = {
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form({
        ...payload,
        date: DateTime.now().toISO(),
        budget_id: budgets[0]?.id,
        task_id: commonTasks?.find((task) => task.name === CommonTask.DEVELOPMENT)?.id,
      })
      .withCsrfToken()
      .loginAs(authUser)

    await activeEntry.refresh()

    response.assertStatus(200)
    assert.containsSubset(activeEntry.serialize(), {
      duration_minutes: 40,
      last_stopped_at: DateTime.now().set({ millisecond: 0 }).toISO(),
      status: TimeSheetStatus.PENDING,
    })
  })

  test('unauthorized user cannot create an organisation time entry', async ({ client, route }) => {
    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
  })
})
