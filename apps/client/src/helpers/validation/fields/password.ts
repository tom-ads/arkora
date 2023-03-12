import { z } from 'zod'
import validationIssuer from '../issuer'

export const validatePassword = (
  password: string,
  options?: { ctx?: z.RefinementCtx; field?: string },
) => {
  const criteriaResult = [
    {
      isValid: password?.length >= 8,
      errorMessage: 'Contains 8 or more characters',
    },
    {
      isValid: /[A-Z]+/.test(password),
      errorMessage: 'Contains one uppercase character',
    },
    {
      // NOTE: this will return true as JS uses type coercion to convert it into "undefined"
      isValid: /[a-z]+/.test(password),
      errorMessage: 'Contains one lowercase character',
    },
    {
      isValid: /[0-9]+/.test(password),
      errorMessage: 'Contains one number',
    },
    {
      isValid: /[~!@#$£%^&*]+/.test(password),
      errorMessage: 'Contains one special character ([ ~ ! @ # $ £ % ^ & *)',
    },
  ]

  if (options?.ctx && options?.field) {
    validationIssuer(options.field, criteriaResult, options.ctx)
  }

  return criteriaResult
}
