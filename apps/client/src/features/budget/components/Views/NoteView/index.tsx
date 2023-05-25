import { useState } from 'react'
import { BudetNotesTable } from '../../Tables'
import { ManageBudgetNoteModal } from '../../Modals'

export const BudgetNoteView = (): JSX.Element => {
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)

  return (
    <>
      <BudetNotesTable onManage={setSelectedNoteId} />

      <ManageBudgetNoteModal
        isOpen={!!selectedNoteId}
        onClose={() => setSelectedNoteId(null)}
        noteId={selectedNoteId}
      />
    </>
  )
}
