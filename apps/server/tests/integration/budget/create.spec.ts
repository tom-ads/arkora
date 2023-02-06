import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import BudgetKind from 'App/Enum/BudgetKind'
import {
  BudgetFactory,
  BudgetTypeFactory,
  OrganisationFactory,
  RoleFactory,
  UserFactory,
} from 'Database/factories'
import User from 'App/Models/User'
import Organisation from 'App/Models/Organisation'
import Budget from 'App/Models/Budget'
import { createBillableTypes } from 'Database/factories/BillableTypeFactory'
import BillableType from 'App/Models/BillableType'

test.group('Budgets : Create Budget', (group) => {
  let authUser: User
  let organisation: Organisation
  let billableTypes: BillableType[]

  group.setup(async () => {
    billableTypes = await createBillableTypes()
  })

  group.each.setup(async () => {
    organisation = await OrganisationFactory.with('clients', 1, (clientBuilder) => {
      return clientBuilder.with('projects', 1, (projectBuilder) => {
        return projectBuilder.merge({ name: 'project-1' })
      })
    }).create()
    await organisation.load('projects')

    // Setup organisation owner
    authUser = await UserFactory.merge({ organisationId: organisation.id }).with('role').create()
  })

  test('organisation user can create a variable budget', async ({ client, route }) => {
    const payload = {
      project_id: organisation.projects[0].id,
      name: faker.company.name(),
      colour: faker.color.rgb(),
      private: false,
      budget_type: BudgetKind.VARIABLE,
      billable_type: billableTypes[0].name, // total cost
      hourly_rate: faker.datatype.number({ min: 10000, max: 20000 }), // £100 - £200
      budget: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
    }

    const response = await client
      .post(route('BudgetController.create'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      name: payload.name,
      private: payload.private,
      colour: payload.colour,
      budget: payload.budget,
      hourly_rate: payload.hourly_rate,
      budget_type: {
        name: BudgetKind.VARIABLE,
      },
    })
  })

  test('organisation user can create a fixed budget', async ({ client, route }) => {
    const payload = {
      project_id: organisation.projects[0].id,
      name: faker.company.name(),
      colour: faker.color.rgb(),
      private: true,
      budget_type: BudgetKind.FIXED,
      billable_type: billableTypes[0].name, // total cost
      fixed_price: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
      hourly_rate: faker.datatype.number({ min: 10000, max: 20000 }), // £100 - £200
      budget: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
    }

    const response = await client
      .post(route('BudgetController.create'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      name: payload.name,
      private: payload.private,
      colour: payload.colour,
      budget: payload.budget,
      hourly_rate: payload.hourly_rate,
      budget_type: {
        name: BudgetKind.FIXED,
      },
    })
  })

  test('organisation user can create a non-billable budget', async ({ client, route }) => {
    const payload = {
      project_id: organisation.projects[0].id,
      name: faker.company.name(),
      colour: faker.color.rgb(),
      private: true,
      budget_type: BudgetKind.NON_BILLABLE,
      hourly_rate: faker.datatype.number({ min: 10000, max: 20000 }), // £100 - £200
      budget: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
    }

    const response = await client
      .post(route('BudgetController.create'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      name: payload.name,
      private: payload.private,
      colour: payload.colour,
      budget: payload.budget,
      hourly_rate: payload.hourly_rate,
      budget_type: {
        name: BudgetKind.NON_BILLABLE,
      },
    })
  })

  test('organisation user cannot create a budget', async ({ client, route }) => {
    // Associate member role to auth user
    const memberRole = await RoleFactory.apply('member').create()
    await authUser.related('role').associate(memberRole)

    const response = await client
      .post(route('BudgetController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(403)
  })

  test('organisation admins automatically get assigned to created budget', async ({
    client,
    route,
    assert,
  }) => {
    const payload = {
      project_id: organisation.projects[0].id,
      name: faker.company.name(),
      colour: faker.color.rgb(),
      private: true,
      budget_type: BudgetKind.VARIABLE,
      billable_type: billableTypes[0].name, // total cost
      hourly_rate: faker.datatype.number({ min: 10000, max: 20000 }), // £100 - £200
      budget: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
    }

    const response = await client
      .post(route('BudgetController.create'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      name: payload.name,
      private: payload.private,
      colour: payload.colour,
      budget: payload.budget,
      hourly_rate: payload.hourly_rate,
      budget_type: {
        name: BudgetKind.VARIABLE,
      },
    })

    // Load budget members
    const budget = await Budget.find(response.body().id)
    await budget?.load('members')

    assert.notStrictEqual(
      budget?.members.map((user) => user.serialize()),
      [authUser.serialize()]
    )
  })

  test('creating a project budget throws a 422 when project budget name is already taken', async ({
    route,
    client,
  }) => {
    const project = organisation.projects[0]
    const budgetName = '10k-budget'

    const budgetType = await BudgetTypeFactory.create()
    await BudgetFactory.merge({
      projectId: project.id,
      budgetTypeId: budgetType.id,
      name: budgetName,
    }).create()

    const payload = {
      project_id: organisation.projects[0].id,
      name: budgetName,
      colour: faker.color.rgb(),
      private: true,
      budget_type: BudgetKind.VARIABLE,
      hourly_rate: faker.datatype.number({ min: 10000, max: 20000 }), // £100 - £200
      budget: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
    }

    const response = await client
      .post(route('BudgetController.create'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'name',
          message: 'Name already taken',
        },
      ],
    })
  })

  test('organisation user with diff organisation project id receives a 422', async ({
    client,
    route,
  }) => {
    const payload = {
      project_id: 1000000000,
      name: faker.company.name(),
      colour: faker.color.rgb(),
      private: true,
      budget_type: BudgetKind.VARIABLE,
      hourly_rate: faker.datatype.number({ min: 10000, max: 20000 }), // £100 - £200
      budget: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
    }

    const response = await client
      .post(route('BudgetController.create'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(authUser)

    response.assertStatus(422)
  })

  test('diff organisation user cannot create a budget for another organisation', async ({
    client,
    route,
  }) => {
    const payload = {
      project_id: organisation.projects[0].id,
      name: faker.company.name(),
      colour: faker.color.rgb(),
      private: true,
      budget_type: BudgetKind.VARIABLE,
      hourly_rate: faker.datatype.number({ min: 10000, max: 20000 }), // £100 - £200
      budget: faker.datatype.number({ min: 1000000, max: 2000000 }), // £1m - £2m
    }

    const diffUser = await UserFactory.with('organisation', 1, (orgBuilder) =>
      orgBuilder.merge({ subdomain: 'diff-org' })
    ).create()

    const response = await client
      .post(route('BudgetController.create'))
      .form(payload)
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()
      .loginAs(diffUser)

    response.assertStatus(404)
    response.assertBody({ message: 'Organisation account does not exist' })
  })

  test('unauthenticated user cannot view organisation budgets', async ({ client, route }) => {
    const response = await client
      .get(route('BudgetController.create'))
      .headers({ origin: `http://test-org.arkora.co.uk` })
      .withCsrfToken()

    response.assertStatus(401)
    response.assertBody({
      message: [{ message: 'Unauthenticated. Please login.' }],
    })
  })
})
