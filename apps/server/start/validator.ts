import { validator } from '@ioc:Adonis/Core/Validator'
import { CurrencyCode } from 'App/Enum/CurrencyCode'
import WeekDay from 'App/Enum/WeekDay'
import Client from 'App/Models/Client'
import Organisation from 'App/Models/Organisation'
import Project from 'App/Models/Project'
import Task from 'App/Models/Task'

/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

validator.rule('password', (password, _, options) => {
  if (typeof password !== 'string') {
    return
  }

  const criterias = {
    charCount: {
      achieved: password?.length >= 8,
      suggestion: 'At least 8 characters long',
    },
    uppercase: {
      achieved: /[A-Z]+/.test(password),
      suggestion: 'Contain one uppercase character',
    },
    lowercase: {
      achieved: /[a-z]+/.test(password),
      suggestion: 'Contain one lowercase character',
    },
    number: {
      achieved: /[0-9]+/.test(password),
      suggestion: 'Contain one number',
    },
    symbol: {
      achieved: /[~!@#$£%^&*]+/.test(password),
      suggestion: 'Contain one special character ([ ~ ! @ # $ £ % ^ & *)',
    },
  }

  if (Object.values(criterias).some((c) => !c.achieved)) {
    options.errorReporter.report(
      options.pointer,
      'password',
      'password validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('currencyCode', (currencyCode, _, options) => {
  if (typeof currencyCode !== 'string') {
    return
  }

  const supportedCurrencyCode = Object.values(CurrencyCode).some((code) => code === currencyCode)

  if (!supportedCurrencyCode) {
    options.errorReporter.report(
      options.pointer,
      'currencyCode',
      'currencyCode validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('reservedSubdomain', (subdomain, _, options) => {
  if (typeof subdomain !== 'string') {
    throw new Error('"reservedSubdomain" rule can only be used with a number schema type')
  }

  const reservedSubdomains = ['arkora', 'api']

  const isReserved = reservedSubdomains.find(
    (reservedSubdomain) => reservedSubdomain.toLowerCase() === subdomain.toLowerCase()
  )

  if (isReserved) {
    options.errorReporter.report(
      options.pointer,
      'reservedSubdomain',
      'reservedSubdomain validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule('workDays', (workDays, _, options) => {
  if (!Array.isArray(workDays)) {
    return
  }

  const isInvalid = workDays.some((day) => !Object.values(WeekDay).includes(day))

  if (isInvalid) {
    options.errorReporter.report(
      options.pointer,
      'workDays',
      'workDays validation failed',
      options.arrayExpressionPointer
    )
  }
})

validator.rule(
  'organisationProject',
  async (projectId, [organisationId], options) => {
    if (typeof organisationId !== 'number') {
      throw new Error('"organisationProject" rule can only be used with a number schema type')
    }

    const exists = await Organisation.query()
      .where('id', organisationId)
      .whereHas('projects', (projectQuery) => {
        projectQuery.where('projects.id', projectId)
      })
      .first()

    if (!exists || exists.id !== organisationId) {
      options.errorReporter.report(
        options.pointer,
        'organisationProject',
        'organisationProject validation failed',
        options.arrayExpressionPointer,
        { organisationId }
      )
    }
  },
  () => ({ async: true })
)

validator.rule(
  'organisationEmail',
  async (email, [organisationId, authEmail], options) => {
    if (typeof organisationId !== 'number' || typeof authEmail !== 'string') {
      throw new Error('"organisationEmail" rule can only be used with a number schema type')
    }

    const exists = await Organisation.query()
      .where('id', organisationId)
      .whereHas('users', (projectQuery) => {
        projectQuery.where((query) => {
          query.where('email', email).andWhereNot('email', authEmail)
        })
      })
      .first()

    if (exists) {
      options.errorReporter.report(
        options.pointer,
        'organisationEmail',
        'organisationEmail validation failed',
        options.arrayExpressionPointer,
        { organisationId }
      )
    }
  },
  () => ({ async: true })
)

validator.rule(
  'organisationClient',
  async (clientId, [organisationId], options) => {
    if (typeof organisationId !== 'number') {
      throw new Error('"organisationClient" rule can only be used with a number schema type')
    }

    const exists = await Client.query()
      .where('id', clientId)
      .whereHas('organisation', (query) => {
        query.where('id', organisationId)
      })
      .first()

    if (!exists) {
      options.errorReporter.report(
        options.pointer,
        'organisationClient',
        'organisationClient validation failed',
        options.arrayExpressionPointer,
        { organisationId }
      )
    }
  },
  () => ({ async: true })
)

validator.rule(
  'budgetName',
  async (name, [projectId, exceptCurrentName], options) => {
    if (typeof projectId !== 'number') {
      throw new Error('"budgetName" rule can only be used with a string schema type')
    }

    const exists = await Project.query()
      .where('id', projectId)
      .whereHas('budgets', (budgetQuery) => {
        budgetQuery.where('name', name)
      })
      .first()

    /* 
      Validator can optionally handle the case of needing to not include 
      the current name from the check
    */
    if (exists && !exceptCurrentName) {
      options.errorReporter.report(
        options.pointer,
        'budgetName',
        'budgetName validation failed',
        options.arrayExpressionPointer,
        { projectId, exceptCurrentName }
      )
    }
  },
  () => ({ async: true })
)

validator.rule(
  'budgetTaskName',
  async (name, [budgetId, exceptCurrentName], options) => {
    const exists = await Task.query().where('budget_id', budgetId).where('name', name).first()

    /* 
      Validator can optionally handle the case of needing to not include 
      the current name from the check
    */
    if (exists && !exceptCurrentName) {
      options.errorReporter.report(
        options.pointer,
        'budgetTaskName',
        'budgetTaskName validation failed',
        options.arrayExpressionPointer,
        { budgetId, exceptCurrentName }
      )
    }
  },
  () => ({ async: true })
)
