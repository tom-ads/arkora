import { BudgetsTable, ManageBudgetModal, useGetBudgetsQuery } from '@/features/budget'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectBudgetView = (): JSX.Element => {
  const [budgetId, setBudgetId] = useState<number | null>(null)

  const { projectId } = useParams()

  const { data: projectBudgets } = useGetBudgetsQuery(
    { project_id: parseInt(projectId!, 10) },
    { skip: !projectId },
  )

  return (
    <>
      <BudgetsTable onManageRow={(id) => setBudgetId(id)} value={projectBudgets ?? null} />

      <ManageBudgetModal
        projectId={projectId ? parseInt(projectId, 10) : null}
        budgetId={budgetId}
        isOpen={!!budgetId}
        onClose={() => setBudgetId(null)}
      />
    </>
  )
}
