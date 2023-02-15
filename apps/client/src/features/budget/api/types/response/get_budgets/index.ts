import { Budget } from '@/types'
import Project from '@/types/Project'

type BudgetProject = Budget & { project?: Project }

type GetBudgetsResponse = BudgetProject[]

export default GetBudgetsResponse
