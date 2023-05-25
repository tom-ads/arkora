import BillableType from '@/enums/BillableType'
import { BudgetType } from './BudgetType'
import Project from './Project'

export type BaseMetrics = {
  allocatedBudget: number
  allocatedDuration: number
  billableCost: number
  billableDuration: number
  unbillableCost: number
  unbillableDuration: number
}

export type Budget = BaseMetrics & {
  id: number
  projectId: number
  name: string
  colour: string
  fixedPrice?: number
  hourlyRate: number
  private: boolean
  budgetType: BudgetType
  billableType: {
    name: BillableType
  }
  spentCost: number
  remainingCost: number
}

export type BudgetWithProject = Budget & BaseMetrics & { project: Project }
