import { ManageBudgetModal } from '@/features/budget'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BudgetsTable } from '../../Tables'

export const ProjectBudgetView = (): JSX.Element => {
  const [budgetId, setBudgetId] = useState<number | null>(null)

  const { projectId } = useParams()

  return (
    <>
      <BudgetsTable onManage={(id) => setBudgetId(id)} />

      <ManageBudgetModal
        projectId={projectId ? parseInt(projectId, 10) : null}
        budgetId={budgetId}
        isOpen={!!budgetId}
        onClose={() => setBudgetId(null)}
      />
    </>
  )
}
