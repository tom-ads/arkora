import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'

type CreateBudgetRequest = {
  project_id: number
  name: string
  colour: string
  private: boolean
  budget_type?: BudgetType
  hourly_rate?: number
  budget: number
  billable_type?: BillableType
  fixedPrice?: number
}

export default CreateBudgetRequest
