import { z } from 'zod'
import { ValidationCriteria } from '@/types/validation/criteria'

const validationIssuer = (path: string, result: ValidationCriteria[], ctx: z.RefinementCtx) => {
  if (result.some((issue) => !issue.isValid)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.find((issue) => !issue.isValid)?.errorMessage,
      path: [path],
    })
  }
}

export default validationIssuer
