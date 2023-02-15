import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'

type UpdateBudgetRequest = {
  budget_id: number
  project_id: number
  name: string
  colour: string
  private: boolean
  budget_type?: BudgetType
  hourly_rate: number | null
  budget: number
  billable_type?: BillableType
  fixed_price: number | null
}

export default UpdateBudgetRequest
