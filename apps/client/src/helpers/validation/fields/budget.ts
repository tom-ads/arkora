import { z } from 'zod'
import validationIssuer from '../issuer'

export const validateBudgetField = (
  budget: number | null | undefined,
  options?: { ctx?: z.RefinementCtx },
) => {
  const criteriaResult = [
    { isValid: budget !== undefined && budget !== null, errorMessage: 'Budget is required' },
    { isValid: (budget ?? 0) > 0, errorMessage: 'Must be greater than 0' },
  ]

  if (options?.ctx) {
    validationIssuer('budget', criteriaResult, options.ctx)
  }

  return criteriaResult
}
