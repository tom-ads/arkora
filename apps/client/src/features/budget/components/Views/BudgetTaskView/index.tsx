import { useState } from 'react'
import { ManageBudgetTaskModal } from '../../Modals'
import { BudgetTasksTable } from '../../Tables'

export const BudgetTaskView = (): JSX.Element => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  return (
    <>
      <BudgetTasksTable onManage={(taskId: number) => setSelectedTaskId(taskId)} />

      <ManageBudgetTaskModal
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId}
      />
    </>
  )
}
