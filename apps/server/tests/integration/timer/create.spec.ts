import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import ProjectStatus from 'App/Enum/ProjectStatus'
import TimeSheetStatus from 'App/Enum/TimeSheetStatus'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Task from 'App/Models/Task'
import User from 'App/Models/User'
import { OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import TaskFactory from 'Database/factories/TaskFactory'
import TimeEntryFactory from 'Database/factories/TimeEntryFactory'
import { DateTime } from 'luxon'

test.group('Timer : Create', (group) => {
  let authUser: User
  let organisation: Organisation
  let commonTasks: Task[]
  let budgets: Budget[]

  group.tap((test) => test.tags(['@timer']))

  group.each.setup(async () => {
    organisation = await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      return clientBuilder.with('projects', 2, (projectBuilder) => {
        return projectBuilder
          .merge([{ name: 'project-1' }, { name: 'project-2' }])
          .with('budgets', 2, (budgetQuery) => budgetQuery.with('budgetType'))
      })
    }).create()

    // Setup common organisation tasks
    commonTasks = await TaskFactory.merge([
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

    budgets = organisation.projects.map((project) => project.budgets).flat()

    // Link tasks to budgets
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

    authUser = await UserFactory.merge({ organisationId: organisation.id }).create()
    await Promise.all(
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id]))
    )
  })

  test('organisation member can create time entry', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      budget_id: budgets[0]?.id,
      task_id: commonTasks?.find((task) => task.name === DefaultTask.DEVELOPMENT)?.id,
      date: DateTime.now().toISO(),
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      estimated_minutes: 480,
      duration_minutes: 0,
      description: 'example description',
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation manager can create time entry', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const payload = {
      budget_id: budgets[0]?.id,
      task_id: commonTasks?.find((task) => task.name === DefaultTask.DEVELOPMENT)?.id,
      date: DateTime.now().toISO(),
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      estimated_minutes: 480,
      duration_minutes: 0,
      description: 'example description',
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation org_admin can create time entry', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const payload = {
      budget_id: budgets[0]?.id,
      task_id: commonTasks?.find((task) => task.name === DefaultTask.DEVELOPMENT)?.id,
      date: DateTime.now().toISO(),
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      estimated_minutes: 480,
      duration_minutes: 0,
      description: 'example description',
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation owner can create time entry', async ({ client, route }) => {
    const payload = {
      budget_id: budgets[0]?.id,
      task_id: commonTasks?.find((task) => task.name === DefaultTask.DEVELOPMENT)?.id,
      date: DateTime.now().toISO(),
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      estimated_minutes: 480,
      duration_minutes: 0,
      description: 'example description',
      status: TimeSheetStatus.PENDING,
    })
  })

  test('organisation user cannot create time entry for non-active projects', async ({
    client,
    route,
  }) => {
    const payload = {
      budget_id: budgets[0]?.id,
      task_id: commonTasks?.find((task) => task.name === DefaultTask.DEVELOPMENT)?.id,
      date: DateTime.now().toISO(),
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    // Change budget project status to pending, instead of active
    await budgets[0].related('project').query().update({ status: ProjectStatus.PENDING })

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Only active projects can be tracked against' })
  })

  test('organisation user cannot create time entry on unrelated budget', async ({
    client,
    route,
  }) => {
    await budgets[0].related('members').detach([authUser.id])

    const payload = {
      budget_id: budgets[0]?.id,
      task_id: commonTasks?.find((task) => task.name === DefaultTask.DEVELOPMENT)?.id,
      date: DateTime.now().toISO(),
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('active timer is stopped before creating a new organisation time entry for auth user', async ({
    client,
    route,
    assert,
  }) => {
    // Setup active timer
    const activeEntry = await TimeEntryFactory.merge({
      userId: authUser.id,
      durationMinutes: 20,
      lastStartedAt: DateTime.now().minus({ minutes: 20 }),
    }).create()

    const payload = {
      budget_id: budgets[0]?.id,
      task_id: commonTasks?.find((task) => task.name === DefaultTask.DEVELOPMENT)?.id,
      date: DateTime.now().toISO(),
      estimated_minutes: 480, // 8 hours
      duration_minutes: 0,
      description: 'example description',
    }

    const response = await client
      .post(route('TimerController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
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
