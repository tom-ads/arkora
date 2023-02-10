import BillableType from '@/enums/BillableType'
import { BudgetType } from './BudgetType'

export type Budget = {
  id: number
  name: string
  colour: string
  fixedPrice?: number
  hourlyRate: number
  private: boolean
  budgetType: BudgetType
  billableType: {
    name: BillableType
  }
  totalCost: number
  totalMinutes: number
  totalSpent: number
  totalRemaining: number
  totalBillable: number
  totalBillableMinutes: number
  totalNonBillable: number
  totalNonBillableMinutes: number
}
