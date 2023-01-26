import { validator } from '@ioc:Adonis/Core/Validator'
import { CurrencyCode } from 'App/Enum/CurrencyCode'
import WeekDay from 'App/Enum/WeekDay'
import Organisation from 'App/Models/Organisation'

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
  ([organisationId]) => ({ async: true })
)
