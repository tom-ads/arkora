import { Button, Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { useState } from 'react'
import { CreateProjectModal } from '../../components'
import { ProjectsTable } from '../../components/Tables/ProjectsTable'

export const ProjectsPage = (): JSX.Element => {
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false)

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Projects</PageTitle>
          <PageDescription>Manage your organisations projects and view insights</PageDescription>
        </div>
        <Button variant="secondary" size="xs" onClick={() => setOpenCreateProjectModal(true)}>
          Create Project
        </Button>
      </PageHeader>

      <PageContent>
        <ProjectsTable />
      </PageContent>

      {/* Modals */}
      <CreateProjectModal
        isOpen={openCreateProjectModal}
        onClose={() => setOpenCreateProjectModal(false)}
      />
    </Page>
  )
}
