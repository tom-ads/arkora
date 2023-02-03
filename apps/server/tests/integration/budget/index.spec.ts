import { test } from '@japa/runner'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import User from 'App/Models/User'
import { OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Budgets: All Budgets', ({ each }) => {
  let organisation: Organisation
  let projects: Project[]
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

    // Prelod projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    projects = organisation.projects
    budgets = projects.map((project) => project.budgets).flat()

    // Create auth user
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Associate authUser to relations
    await Promise.all([
      ...projects.map(async (project) => await project.related('members').attach([authUser.id])),
      ...budgets.map(async (budget) => await budget.related('members').attach([authUser.id])),
    ])
  })

  /*
    Tests
  */

  test('organisation member can index budgets', async ({ client, route }) => {
    // Associate member role to auth user
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains(budgets.map((budget) => budget.serialize()))
  })

  test('organisation manager can index budgets', async ({ client, route }) => {
    // Associate manager role to auth user
    const memberRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains(budgets.map((budget) => budget.serialize()))
  })

  test('organisation org_admin can index budgets', async ({ client, route }) => {
    // Associate org_admin role to auth user
    const memberRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains(budgets.map((budget) => budget.serialize()))
  })

  test('organisation owner can index budgets', async ({ client, route }) => {
    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains(budgets.map((budget) => budget.serialize()))
  })

  test('organisation user not assigned as project member cannot retrieve related budgets', async ({
    client,
    route,
  }) => {
    // Unlink all related projects
    await Promise.all(
      projects.map(async (project) => await project.related('members').detach([authUser.id]))
    )

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody([])
  })

  test('organisation user not assigned as project member cannot retrieve related budgets', async ({
    client,
    route,
  }) => {
    // Unlink all related project budget
    await Promise.all(
      budgets.map(async (budget) => await budget.related('members').detach([authUser.id]))
    )

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody([])
  })

  test('organisation user can filter by project_id', async ({ client, route }) => {
    const testProject = projects[0]

    const response = await client
      .get(route('BudgetController.index'))
      .qs({ project_id: testProject.id })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody(testProject.budgets.map((budget) => budget.serialize()))
  })

  test('organisation user can filter by user_id', async ({ client, route }) => {
    const testProject = projects[0]
    const testBudgets = testProject.budgets[0]

    const memberUser = await UserFactory.merge({ organisationId: organisation.id })
      .with('role', 1, (roleBuilder) => roleBuilder.apply('member'))
      .create()

    await memberUser.related('projects').attach([testProject.id])
    await memberUser.related('budgets').attach([testBudgets.id])

    const response = await client
      .get(route('BudgetController.index'))
      .qs({ user_id: memberUser.id })
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBody([testBudgets.serialize()])
  })

  test('organisation user cannot index budgets for a different organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const response = await client
      .get(route('BudgetController.index'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
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
