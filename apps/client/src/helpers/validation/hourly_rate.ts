import { z } from 'zod'

const hourlyRateSchema = z
  .number({ required_error: 'Rate is required' })
  .superRefine((hourlyRate, ctx) => {
    const issues = [
      { test: isNaN(hourlyRate), errorMessage: 'Valid rate required' },
      { test: hourlyRate <= 0, errorMessage: 'Must be greater than 0' },
      { test: hourlyRate > 20000, errorMessage: 'Cannot exceed 20,000' },
    ]

    if (Object.values(issues).some((i) => i.test)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: Object.values(issues).find((p) => p.test)?.errorMessage,
      })
    }
  })

export default hourlyRateSchema
