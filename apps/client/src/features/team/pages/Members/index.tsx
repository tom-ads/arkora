import { Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { MemberFilters } from '../../components/Filters/MemberFilters'
import { TeamMembersTable } from '../../components/Tables'

export const MembersPage = (): JSX.Element => {
  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Team Members</PageTitle>
          <PageDescription>View and manage your organisation team members</PageDescription>
        </span>
      </PageHeader>
      <PageContent className="space-y-5">
        <MemberFilters />

        <TeamMembersTable />
      </PageContent>
    </Page>
  )
}
