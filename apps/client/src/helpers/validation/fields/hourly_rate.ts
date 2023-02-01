import { z } from 'zod'
import validationIssuer from '../issuer'

export const validateHourlyRateField = (
  hourlyRate: number | undefined,
  options?: { ctx?: z.RefinementCtx },
) => {
  const criteriaResult = [
    {
      isValid: hourlyRate !== undefined && hourlyRate !== null && !isNaN(hourlyRate),
      errorMessage: 'Rate is required',
    },
    { isValid: (hourlyRate ?? 0) > 0, errorMessage: 'Must be greater than 0' },
    { isValid: (hourlyRate ?? 0) <= 20000, errorMessage: 'Cannot exceed 20,000' },
  ]

  if (options?.ctx) {
    validationIssuer('hourlyRate', criteriaResult, options.ctx)
  }

  return criteriaResult
}
