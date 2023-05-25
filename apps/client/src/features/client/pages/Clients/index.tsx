import { Button, Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ClientsTable } from '../../components'
import { CreateClientModal, ManageClientModal } from '../../components/Modals'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const ClientsPage = (): JSX.Element => {
  useDocumentTitle('Clients')

  const [openCreateClientModal, setOpenCreateClientModal] = useState(false)

  const navigate = useNavigate()

  const { clientId } = useParams()

  return (
    <Page>
      <PageHeader>
        <span>
          <PageTitle>Clients</PageTitle>
          <PageDescription>View and manage the organisations clients</PageDescription>
        </span>
        <Button variant="secondary" size="xs" onClick={() => setOpenCreateClientModal(true)}>
          Create Client
        </Button>
      </PageHeader>
      <PageContent>
        <ClientsTable onCreate={() => setOpenCreateClientModal(true)} />
      </PageContent>

      <CreateClientModal
        isOpen={openCreateClientModal}
        onClose={() => setOpenCreateClientModal(false)}
      />

      <ManageClientModal isOpen={!!clientId} onClose={() => navigate('/clients')} />
    </Page>
  )
}
