import { test } from '@japa/runner'
import Budget from 'App/Models/Budget'
import BudgetNote from 'App/Models/BudgetNote'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import BudgetNoteFactory from 'Database/factories/BudgetNoteFactory'

test.group('Budget Notes : Update', (group) => {
  let organisation: Organisation
  let budget: Budget
  let authUser: User
  let budgetNote: BudgetNote

  group.tap((test) => test.tags(['@budget-notes']))

  group.each.setup(async () => {
    // Setup organisation
    organisation = await OrganisationFactory.create()

    // Setup budget, project and client for organisation
    budget = await BudgetFactory.with('project', 1, (projectBuilder) => {
      projectBuilder.with('client', 1, (clientBuilder) => {
        clientBuilder.merge({ organisationId: organisation.id })
      })
    })
      .with('budgetType')
      .with('billableType')
      .create()

    // Create auth user
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()

    // Assign authUser as budget member
    await budget.related('members').attach([authUser.id])

    budgetNote = await BudgetNoteFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
    }).create()
  })

  test('organisation manager can update budget notes', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const payload = {
      note: 'This is a note description',
    }

    const response = await client
      .put(route('BudgetNoteController.update', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation org_admin can update budget note', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const payload = {
      note: 'This is a note description',
    }

    const response = await client
      .put(route('BudgetNoteController.update', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation owner can update budget note', async ({ client, route }) => {
    const payload = {
      note: 'This is a note description',
    }

    const response = await client
      .put(route('BudgetNoteController.update', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains(payload)
  })

  test('organisation member cannot update budget notes', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const payload = {
      note: 'This is a note description',
    }

    const response = await client
      .put(route('BudgetNoteController.update', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('organisation user cannot update budget note from another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const payload = {
      note: 'This is a note description',
    }

    const response = await client
      .put(route('BudgetNoteController.update', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .form(payload)
      .loginAs(diffUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('unauthenticated user cannot update budget note', async ({ client, route }) => {
    const payload = {
      note: 'This is a note description',
    }

    const response = await client
      .put(route('BudgetNoteController.update', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .form(payload)
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
