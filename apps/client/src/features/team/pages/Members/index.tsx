import { Page, PageDescription, PageHeader, PageTitle } from '@/components'

export const MembersPage = (): JSX.Element => {
  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Team Members</PageTitle>
          <PageDescription>View and manage team member(s)</PageDescription>
        </span>
      </PageHeader>
    </Page>
  )
}
