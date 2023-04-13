import BillableType from '@/enums/BillableType'
import { BudgetType } from './BudgetType'

export type BudgetBaseMetrics = {
  allocatedBudget: number
  allocatedDuration: number
  billableCost: number
  billableDuration: number
  unbillableCost: number
  unbillableDuration: number
}

export type Budget = BudgetBaseMetrics & {
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
