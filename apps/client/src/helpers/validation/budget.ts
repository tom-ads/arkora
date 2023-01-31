import { z } from 'zod'

const budgetSchema = z.number({ required_error: 'Budget is required' })

export default budgetSchema
