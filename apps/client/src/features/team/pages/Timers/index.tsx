import { Page, PageDescription, PageHeader, PageTitle } from '@/components'

export const TimersPage = (): JSX.Element => {
  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Team Timers</PageTitle>
          <PageDescription>View and manage the teams timer(s)</PageDescription>
        </span>
      </PageHeader>
    </Page>
  )
}
