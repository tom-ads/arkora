import { Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { useGetTimersQuery } from '@/features/timer'
import { useMemo } from 'react'
import { ActiveTimersList, InactiveTimersList, TimersStatsCard } from '../../components'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

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
          <PageDescription>View and manage the teams timer(s)</PageDescription>
        </span>
      </PageHeader>
      <PageContent>
        <TimersStatsCard />

        <ActiveTimersList value={teamTimers.active} />

        <InactiveTimersList value={teamTimers.inactive} />
      </PageContent>
    </Page>
  )
}
