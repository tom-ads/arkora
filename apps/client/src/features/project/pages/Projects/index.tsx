import { Button, Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useState } from 'react'
import { CreateProjectModal, ManageProjectModal } from '../../components'
import { ProjectsTable } from '../../components/Tables/ProjectsTable'
import { useAuthorization } from '@/hooks/useAuthorization'

export const ProjectsPage = (): JSX.Element => {
  useDocumentTitle('Projects')

  const [projectId, setProjectId] = useState<number | null>(null)
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false)

  const { checkPermission } = useAuthorization()

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Projects</PageTitle>
          <PageDescription>Manage your organisations projects and view insights</PageDescription>
        </div>
        {checkPermission('project:create') && (
          <Button variant="secondary" size="xs" onClick={() => setOpenCreateProjectModal(true)}>
            Create Project
          </Button>
        )}
      </PageHeader>

      <PageContent>
        <ProjectsTable
          onCreate={() => setOpenCreateProjectModal(true)}
          onManage={(id) => setProjectId(id)}
        />
      </PageContent>

      {/* Modals */}
      <CreateProjectModal
        isOpen={openCreateProjectModal}
        onClose={() => setOpenCreateProjectModal(false)}
      />
      <ManageProjectModal
        projectId={projectId}
        isOpen={!!projectId}
        onClose={() => setProjectId(null)}
      />
    </Page>
  )
}
