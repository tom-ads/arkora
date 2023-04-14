import { Button, Page, PageBackBtn, PageContent, PageHeader, PageTitle } from '@/components'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetProjectQuery } from '../../api'
import {
  ManageProjectModal,
  ProjectBudgetView,
  ProjectInsights,
  ProjectTeamView,
  ProjectWidget,
} from '../../components'
import { ProjectTab } from '@/stores/slices/filters/project'
import { ProjectTimeView } from '../../components/Views/Time'
import { useState } from 'react'

const views = {
  budgets: <ProjectBudgetView />,
  entries: <ProjectTimeView />,
  team: <ProjectTeamView />,
}

const ProjectView = () => {
  const { selectedTab } = useSelector((state: RootState) => ({
    selectedTab: state.projectFilters.tab,
  }))

  return views[selectedTab as ProjectTab]
}

export const ProjectPage = (): JSX.Element => {
  useDocumentTitle('Project')

  const [openManageProjectModal, setOpenManageProjectModal] = useState(false)

  const { projectId } = useParams()

  const { data: project, isLoading } = useGetProjectQuery(parseInt(projectId!, 10), {
    skip: !projectId,
  })

  return (
    <Page>
      <PageBackBtn to="/projects">Back to Projects</PageBackBtn>

      <PageHeader>
        <div>
          <PageTitle loading={isLoading}>{project?.name ?? 'Project'}</PageTitle>
          <span className="text-xl text-gray-40 font-medium">
            {project?.client?.name ?? 'Client'}
          </span>
        </div>
        <Button variant="secondary" size="xs" onClick={() => setOpenManageProjectModal(true)}>
          Manage Project
        </Button>
      </PageHeader>
      <PageContent className="space-y-5">
        <ProjectInsights />

        <ProjectWidget />

        <ProjectView />
      </PageContent>

      <ManageProjectModal
        projectId={projectId ? parseInt(projectId, 10) : null}
        isOpen={openManageProjectModal}
        onClose={() => setOpenManageProjectModal(false)}
      />
    </Page>
  )
}
