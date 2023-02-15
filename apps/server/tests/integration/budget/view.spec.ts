import { test } from '@japa/runner'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { BudgetTypeFactory, OrganisationFactory, UserFactory } from 'Database/factories'
import BillableTypeFactory from 'Database/factories/BillableTypeFactory'

test.group('Budgets : View Budget', ({ each }) => {
  let budget: Budget
  let authUser: User
  let organisation: Organisation

  /* 
    Setup
  */

  each.setup(async () => {
    const budgetType = await BudgetTypeFactory.apply('variable').create()
    const billableType = await BillableTypeFactory.apply('total_cost').create()

    organisation = await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      return clientBuilder.with('projects', 1, (projectBuilder) => {
        return projectBuilder.merge({ name: 'project-1' }).with('budgets', 1, (budgetQuery) =>
          budgetQuery.merge({
            billableTypeId: billableType.id,
            budgetTypeId: budgetType.id,
            budget: 10000000, // £100,000
            hourlyRate: 10000, // £100
          })
        )
      })
    }).create()

    // Prelod projects and budgets
    await organisation.load('projects')
    await Promise.all(organisation.projects.map(async (project) => await project.load('budgets')))

    const projects = organisation.projects
    const budgets = projects.map((project) => project.budgets).flat()

    budget = budgets[0]

    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    await Promise.all([
      projects[0].related('members').attach([authUser.id]),
      budget.related('members').attach([authUser.id]),
    ])
  })

  test('organisation user can view a specific budget', async ({ client, route }) => {
    const response = await client
      .get(route('BudgetController.view', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains(budget.serialize())
  })

  /* 
    Tests
  */

  test('organisation user not assigned to budget, cannot view budget', async ({
    client,
    route,
  }) => {
    budget.related('members').detach([authUser.id])

    const response = await client
      .get(route('BudgetController.view', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation user cannot view another organisations budget', async ({ client, route }) => {
    const diffOrgUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const response = await client
      .get(route('BudgetController.view', { budgetId: budget.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffOrgUser)

    response.assertStatus(404)
  })

  test('unauthenticated user cannot view organisation budget', async ({ client, route }) => {
    const response = await client
      .get(route('BudgetController.view', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
