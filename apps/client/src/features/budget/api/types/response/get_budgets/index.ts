import { Budget } from '@/types'
import Project from '@/types/models/Project'

type BudgetProject = Budget & { project?: Project }

type GetBudgetsResponse = BudgetProject[]

export default GetBudgetsResponse
