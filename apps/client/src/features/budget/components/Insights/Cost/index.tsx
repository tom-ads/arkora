import { CostBreakdownWidget } from '@/components'
import { useGetBudgetQuery } from './../../../api'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import UserRole from '@/enums/UserRole'

export const BudgetCostInsights = (): JSX.Element => {
  const { budgetId } = useParams()

  const authRole = useSelector((state: RootState) => state.auth.user?.role?.name)

  const { data: budget } = useGetBudgetQuery(parseInt(budgetId!, 10), { skip: !budgetId })

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
        showCost: authRole === UserRole.MEMBER ? budget?.project?.showCost : true,
      }}
    />
  )
}
