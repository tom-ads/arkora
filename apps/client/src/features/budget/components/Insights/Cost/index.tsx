import { CostBreakdownWidget } from '@/components'
import { useGetBudgetQuery } from './../../../api'
import { useParams } from 'react-router-dom'

export const BudgetCostInsights = (): JSX.Element => {
  const { budgetId } = useParams()

  const { data: budget } = useGetBudgetQuery(budgetId!, { skip: !budgetId })

  return (
    <CostBreakdownWidget
      value={{
        allocatedBudget: budget?.allocatedBudget ?? 0,
        allocatedDuration: budget?.allocatedDuration ?? 0,
        billableCost: budget?.billableCost ?? 0,
        billableDuration: budget?.billableDuration ?? 0,
        unbillableCost: budget?.unbillableCost ?? 0,
        unbillableDuration: budget?.unbillableDuration ?? 0,
        private: budget?.private ?? true,
      }}
    />
  )
}
