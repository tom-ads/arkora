import { z } from 'zod'
import validationIssuer from '../issuer'

export const validateFixedPriceField = (
  fixedPrice: number | null | undefined,
  options?: { ctx?: z.RefinementCtx },
) => {
  const criteriaResult = [
    {
      isValid: fixedPrice !== undefined && fixedPrice !== null && !isNaN(fixedPrice),
      errorMessage: 'Price is required',
    },
    { isValid: (fixedPrice ?? 0) > 0, errorMessage: 'Must be greater than 0' },
  ]

  if (options?.ctx) {
    validationIssuer('fixedPrice', criteriaResult, options.ctx)
  }

  return criteriaResult
}
