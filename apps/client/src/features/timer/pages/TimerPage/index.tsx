import { Button, Page, PageDescription, PageHeader, PageTitle } from '@/components'
import { useState } from 'react'
import { NewTimeEntryModal } from '../../components/Modals/NewTimeEntry'

export const TimerPage = (): JSX.Element => {
  const [openNewTimeEntryModal, setOpenNewTimeEntryModal] = useState(false)

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Tracking</PageTitle>
          <PageDescription>Start tracking against a budget to record your time</PageDescription>
        </div>
        <Button
          variant="secondary"
          size="xs"
          onClick={() => setOpenNewTimeEntryModal((state) => !state)}
        >
          Start Tracking
        </Button>
      </PageHeader>

      <NewTimeEntryModal
        isOpen={openNewTimeEntryModal}
        onClose={() => setOpenNewTimeEntryModal((state) => !state)}
      />
    </Page>
  )
}
