import { BudgetType } from './BudgetType'

export type Budget = {
  id: number
  name: string
  budget: number
  hourlyRate: number
  billable: boolean
  private: boolean
  budgetType: BudgetType
}
