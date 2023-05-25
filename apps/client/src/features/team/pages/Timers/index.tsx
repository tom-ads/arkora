import {
  Card,
  HorizontalDivider,
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components'
import { useGetTimersQuery } from '@/features/timer'
import { useMemo } from 'react'
import { ActiveTimersList, InactiveTimersList } from '../../components'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { padStart } from 'lodash'

export const TimersPage = (): JSX.Element => {
  useDocumentTitle('Team Timers')

  const { data } = useGetTimersQuery(undefined, { pollingInterval: 3000 })

  const teamTimers = useMemo(() => {
    return {
      active: data?.filter((member) => member.timer?.id) ?? [],
      inactive: data?.filter((member) => !member.timer?.id) ?? [],
    }
  }, [data])

  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Team Timers</PageTitle>
          <PageDescription>View team members timers</PageDescription>
        </span>
      </PageHeader>
      <PageContent>
        <Card className="mb-8">
          <div className="flex items-center gap-4">
            <p className="text-gray-60 font-semibold text-xl whitespace-nowrap">
              <span className="text-gray-100">{padStart(`${teamTimers.active?.length}`)}</span>{' '}
              Active Timers
            </p>
            <HorizontalDivider />
          </div>
        </Card>

        <ActiveTimersList value={teamTimers.active} />

        <Card className="my-8">
          <div className="flex items-center gap-4">
            <p className="text-gray-60 font-semibold text-xl whitespace-nowrap">
              <span className="text-gray-100">{padStart(`${teamTimers.inactive?.length}`)}</span>{' '}
              Inactive Timers
            </p>
            <HorizontalDivider />
          </div>
        </Card>

        <InactiveTimersList value={teamTimers.inactive} />
      </PageContent>
    </Page>
  )
}
