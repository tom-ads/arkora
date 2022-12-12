import {
  ArrowThin,
  Button,
  Card,
  Divider,
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components'
import { useGetTimesheetQuery } from '@/features/timesheet'
import { RootState } from '@/stores/store'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { TimesheetPeriod } from '../../components'
import { NewTimeEntryModal } from '../../components/Modals/NewTimeEntry'

export const TimerPage = (): JSX.Element => {
  const [openNewTimeEntryModal, setOpenNewTimeEntryModal] = useState(false)

  const { timesheet } = useSelector((state: RootState) => ({
    timesheet: state.timer.timesheet,
  }))

  const { data } = useGetTimesheetQuery({
    start_date: DateTime.now().startOf('week').toISO(),
    end_date: DateTime.now().endOf('week').toISO(),
  })

  const period = useMemo(
    () => ({
      startDate: DateTime.fromISO(timesheet.startDate!).toFormat('dd LLL, yyyy'),
      endDate: DateTime.fromISO(timesheet.endDate!).toFormat('dd LLL, yyyy'),
    }),
    [timesheet],
  )

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

      <PageContent>
        <TimesheetPeriod />
      </PageContent>

      <NewTimeEntryModal
        isOpen={openNewTimeEntryModal}
        onClose={() => setOpenNewTimeEntryModal((state) => !state)}
      />
    </Page>
  )
}
