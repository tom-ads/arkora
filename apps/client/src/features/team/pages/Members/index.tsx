import { Button, Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { useState } from 'react'
import { InviteMembersModal } from '../../components'
import { MemberFilters } from '../../components/Filters/MemberFilters'
import { TeamMembersTable } from '../../components/Tables'

export const MembersPage = (): JSX.Element => {
  const [openInviteMembersModal, setOpenInviteMembersModal] = useState(false)

  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Team Members</PageTitle>
          <PageDescription>View and manage your organisation team members</PageDescription>
        </span>
        <Button variant="secondary" size="xs" onClick={() => setOpenInviteMembersModal(true)}>
          Invite Members
        </Button>
      </PageHeader>
      <PageContent className="space-y-5">
        <MemberFilters />

        <TeamMembersTable />
      </PageContent>

      <InviteMembersModal
        onClose={() => setOpenInviteMembersModal(false)}
        isOpen={openInviteMembersModal}
      />
    </Page>
  )
}
