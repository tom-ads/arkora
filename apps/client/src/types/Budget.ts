import { BudgetType } from './BudgetType'

export type Budget = {
  id: number
  name: string
  colour: string
  fixedPrice?: number
  budget: number
  hourlyRate: number
  private: boolean
  budgetType: BudgetType
  totalSpent: number
  totalRemaining: number
  totalBillable: number
  totalNonBillable: number
}
