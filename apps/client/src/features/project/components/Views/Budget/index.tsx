import { ManageBudgetModal } from '@/features/budget'
import { useState } from 'react'
import { BudgetsTable } from '../../Tables'

export const ProjectBudgetView = (): JSX.Element => {
  const [budgetId, setBudgetId] = useState<number | null>(null)

  return (
    <>
      <BudgetsTable onManage={(id) => setBudgetId(id)} />

      <ManageBudgetModal
        budgetId={budgetId}
        isOpen={!!budgetId}
        onClose={() => setBudgetId(null)}
      />
    </>
  )
}
