import BillableType from '@/enums/BillableType'
import { BudgetType } from './BudgetType'

export type Budget = {
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
  allocatedBudget: number
  allocatedDuration: number
  spentCost: number
  remainingCost: number
  billableCost: number
  billableDuration: number
  unbillableCost: number
  unbillableDuration: number
}
