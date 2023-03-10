import { ManageTimeEntryModal } from '@/features/timer'
import { useState } from 'react'
import { TimeEntriesTable } from '../../Tables'

export const ProjectTimeView = (): JSX.Element => {
  const [entryId, setEntryId] = useState<number | null>(null)

  return (
    <>
      <TimeEntriesTable onManage={(id) => setEntryId(id)} />

      <ManageTimeEntryModal entryId={entryId} isOpen={!!entryId} onClose={() => setEntryId(null)} />
    </>
  )
}
