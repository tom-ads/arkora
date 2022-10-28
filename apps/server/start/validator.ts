import { validator } from '@ioc:Adonis/Core/Validator'

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
