import { test } from '@japa/runner'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import { OrganisationFactory, UserFactory } from 'Database/factories'

test.group('Budgets: All Budgets', ({ each }) => {
  let organisation: Organisation
  let projects: Project[]
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

    // Prelod projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    projects = organisation.projects
    budgets = projects.map((project) => project.budgets).flat()
  })

  /* 
    Tests
  */

  test('organisation member can index budgets', async ({ client, route }) => {
    const authUser = await UserFactory.with('role').create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      projects.map(async (project) => await project.related('members').attach([authUser.id])),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation manager can index budgets', async ({ client, route }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('manager')
    ).create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      projects.map(async (project) => await project.related('members').attach([authUser.id])),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation org_admin can index budgets', async ({ client, route }) => {
    const authUser = await UserFactory.with('role', 1, (roleBuilder) =>
      roleBuilder.apply('orgAdmin')
    ).create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      projects.map(async (project) => await project.related('members').attach([authUser.id])),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation owner can index budgets', async ({ client, route }) => {
    const authUser = await UserFactory.with('role').create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      projects.map(async (project) => await project.related('members').attach([authUser.id])),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
  })

  test('organisation user can view budgets grouped by project', async ({ client, route }) => {
    const authUser = await UserFactory.with('role').create()

    // Associate authUser to relations
    await Promise.all([
      authUser.related('organisation').associate(organisation),
      projects.map(async (project) => await project.related('members').attach([authUser.id])),
      budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])

    const response = await client
      .get(route('BudgetController.index'))
      .qs({ group_by: 'PROJECT' })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      'project-1': [],
      'project-2': [],
    })
  })

  test('unauthenticated user cannot view organisation budgets', async ({ client, route }) => {
    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
