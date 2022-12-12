import {
  Button,
  Card,
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components'
import { useGetTimesheetQuery } from '@/features/timesheet'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { TimesheetPeriod, WeekDaySelect } from '../../components'
import { NewTimeEntryModal } from '../../components/Modals/NewTimeEntry'

export const TimerPage = (): JSX.Element => {
  const [openNewTimeEntryModal, setOpenNewTimeEntryModal] = useState(false)

  const { data } = useGetTimesheetQuery({
    start_date: DateTime.now().startOf('week').toISODate(),
    end_date: DateTime.now().endOf('week').toISODate(),
  })

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Timer</PageTitle>
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

      <PageContent className="space-y-6">
        <TimesheetPeriod />

        <Card className="p-0">
          <WeekDaySelect />

          <div className="w-full bg-gray-20 h-9 px-6"></div>
        </Card>
      </PageContent>

      <NewTimeEntryModal
        isOpen={openNewTimeEntryModal}
        onClose={() => setOpenNewTimeEntryModal((state) => !state)}
      />
    </Page>
  )
}
