import { test } from '@japa/runner'
import Budget from 'App/Models/Budget'
import BudgetNote from 'App/Models/BudgetNote'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { BudgetFactory, OrganisationFactory, RoleFactory, UserFactory } from 'Database/factories'
import BudgetNoteFactory from 'Database/factories/BudgetNoteFactory'

test.group('Budget Notes : View', (group) => {
  let organisation: Organisation
  let budget: Budget
  let authUser: User
  let budgetNotes: BudgetNote[]

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

    // Setup budget notes
    budgetNotes = await BudgetNoteFactory.merge({
      userId: authUser.id,
      budgetId: budget.id,
    }).createMany(10)
  })

  test('organisation manager can view budget notes', async ({ client, route }) => {
    const managerRole = await RoleFactory.apply('manager').create()
    await authUser.related('role').associate(managerRole)

    const budgetNote = budgetNotes[0]

    const response = await client
      .get(route('BudgetNoteController.view', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      note: budgetNote.note,
    })
  })

  test('organisation org_admin can view budget note', async ({ client, route }) => {
    const orgAdminRole = await RoleFactory.apply('orgAdmin').create()
    await authUser.related('role').associate(orgAdminRole)

    const budgetNote = budgetNotes[0]

    const response = await client
      .get(route('BudgetNoteController.view', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      note: budgetNote.note,
    })
  })

  test('organisation owner can view budget note', async ({ client, route }) => {
    const budgetNote = budgetNotes[0]

    const response = await client
      .get(route('BudgetNoteController.view', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({
      note: budgetNote.note,
    })
  })

  test('organisation member cannot view budget note', async ({ client, route }) => {
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const budgetNote = budgetNotes[0]

    const response = await client
      .get(route('BudgetNoteController.view', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .loginAs(authUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('organisation user cannot view budget note from another organisation', async ({
    client,
    route,
  }) => {
    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) => {
      return orgBuilder.merge({ subdomain: 'diff-org' })
    })
      .with('role')
      .create()

    const budgetNote = budgetNotes[0]

    const response = await client
      .get(route('BudgetNoteController.view', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://diff-org.arkora.co.uk` })
      .loginAs(diffUser)
      .withCsrfToken()

    response.assertStatus(403)
  })

  test('unauthenticated user cannot view budget note', async ({ client, route }) => {
    const budgetNote = budgetNotes[0]

    const response = await client
      .get(route('BudgetNoteController.view', { budgetId: budget.id, noteId: budgetNote.id }))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
