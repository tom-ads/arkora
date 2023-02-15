import { Button, Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { useState } from 'react'
import { CreateProjectModal, UpdateProjectModal } from '../../components'
import { ProjectsTable } from '../../components/Tables/ProjectsTable'

export const ProjectsPage = (): JSX.Element => {
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false)

  const [projectId, setProjectId] = useState<number | null>(null)

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
        <ProjectsTable onManage={(id) => setProjectId(id)} />
      </PageContent>

      {/* Modals */}
      <CreateProjectModal
        isOpen={openCreateProjectModal}
        onClose={() => setOpenCreateProjectModal(false)}
      />
      <UpdateProjectModal
        projectId={projectId}
        isOpen={!!projectId}
        onClose={() => setProjectId(null)}
      />
    </Page>
  )
}
