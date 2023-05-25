import { test } from '@japa/runner'
import { DefaultTask } from 'App/Enum/DefaultTask'
import Budget from 'App/Models/Budget'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'

test.group('Budget Members : Delete', (group) => {
  let organisation: Organisation
  let authUser: User
  let budget: Budget

  group.tap((test) => test.tags(['@budget-members']))

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.create()

    // Setup organisation client, project and budget
    budget = await BudgetFactory.with('project', 1, (projectBuilder) =>
      projectBuilder.with('client', 1, (clientBuilder) =>
        clientBuilder.merge({ organisationId: organisation.id })
      )
    )
      .with('tasks', 3, (taskBuilder) =>
        taskBuilder
          .mergeRecursive({ budget })
          .merge([
            { name: DefaultTask.DESIGN },
            { name: DefaultTask.DEVELOPMENT },
            { name: DefaultTask.DISCOVERY },
          ])
      )
      .with('budgetType')
      .with('billableType')
      .create()

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    await budget.related('members').attach([authUser.id])
  })

  test('organisation manager can unassign budget members', async ({ client, route }) => {
    // Change auth user role
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const response = await client
      .delete(
        route('BudgetMemberController.delete', {
          budgetId: budget.id,
          userId: authUser.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(204)
  })

  test('organisation org_admin can unassign budget members', async ({ client, route }) => {
    // Change auth user role
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const response = await client
      .delete(
        route('BudgetMemberController.delete', {
          budgetId: budget.id,
          userId: authUser.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(204)
  })

  test('organisation owner can unassign budget members', async ({ client, route }) => {
    const response = await client
      .delete(
        route('BudgetMemberController.delete', {
          budgetId: budget.id,
          userId: authUser.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(204)
  })

  test('organisation member cannot unassign budget members', async ({ client, route }) => {
    // Change auth user role
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .delete(
        route('BudgetMemberController.delete', {
          budgetId: budget.id,
          userId: authUser.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('organisation user unassigned to budget, cannot unassign budget members', async ({
    client,
    route,
  }) => {
    await budget.related('members').detach([authUser.id])

    const response = await client
      .delete(
        route('BudgetMemberController.delete', {
          budgetId: budget.id,
          userId: authUser.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('organisation user cannot unassign budget members for another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const response = await client
      .delete(
        route('BudgetMemberController.delete', {
          budgetId: budget.id,
          userId: authUser.id,
        })
      )
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .loginAs(diffUser)
      .withCsrfToken()
      .send()

    response.assertStatus(403)
  })

  test('organisation unassign budget members explicit route has correct form', async ({
    client,
  }) => {
    const response = await client
      .delete(`/api/v1/budgets/${budget.id}/members/${authUser.id}`)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()
      .send()

    response.assertStatus(204)
  })

  test('unauthenticated user cannot unassign budget members', async ({ client, route }) => {
    const response = await client
      .delete(
        route('BudgetMemberController.delete', {
          budgetId: budget.id,
          userId: authUser.id,
        })
      )
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .send()

    response.assertStatus(401)
  })
})
