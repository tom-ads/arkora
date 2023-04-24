import { test } from '@japa/runner'
import BillableKind from 'App/Enum/BillableKind'
import BudgetKind from 'App/Enum/BudgetKind'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import {
  BudgetTypeFactory,
  OrganisationFactory,
  RoleFactory,
  UserFactory,
} from 'Database/factories'
import BillableTypeFactory from 'Database/factories/BillableTypeFactory'

test.group('Budgets : Update Budget', (group) => {
  let budget: Budget
  let authUser: User
  let organisation: Organisation

  group.tap((test) => test.tags(['@budgets']))

  group.each.setup(async () => {
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

  test('organisation admin can update a specific budget', async ({ client, route }) => {
    const payload = {
      budget_id: budget.id,
      project_id: budget.projectId,
      colour: budget.colour,
      private: true,
      name: budget.name,
      fixed_price: 100000000, // 1m
      budget: 30000, // 500hrs
      hourly_rate: 0,
      budget_type: BudgetKind.FIXED,
      billable_type: BillableKind.TOTAL_HOURS,
    }

    const response = await client
      .put(route('BudgetController.update', { budgetId: budget.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    const updatedBudget = await Budget.find(budget.id)

    response.assertStatus(200)
    response.assertBodyContains(updatedBudget!.serialize())
  })

  test('organisation member cannot update a specific budget', async ({ route, client }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      budget_id: budget.id,
      project_id: budget.projectId,
      colour: budget.colour,
      private: true,
      name: budget.name,
      fixed_price: 100000000, // 1m
      budget: 30000, // 500hrs
      hourly_rate: 0,
      budget_type: BudgetKind.FIXED,
      billable_type: BillableKind.TOTAL_HOURS,
    }

    const response = await client
      .put(route('BudgetController.update', { budgetId: budget.id }))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation user not assigned to budget, cannot update budget', async ({
    route,
    client,
  }) => {
    await budget.related('members').detach([authUser.id])

    const response = await client
      .put(route('BudgetController.update', { budgetId: budget.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation user cannot update another organisations budgets', async ({
    client,
    route,
  }) => {
    const diffOrgUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    )
      .with('role')
      .create()

    const response = await client
      .put(route('BudgetController.update', { budgetId: budget.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffOrgUser)

    response.assertStatus(404)
  })

  test('unauthenticated user cannot update organisation budget', async ({ client, route }) => {
    const response = await client
      .put(route('BudgetController.update', { budgetId: budget.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
