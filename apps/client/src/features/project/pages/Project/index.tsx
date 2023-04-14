import { Page, PageBackBtn, PageContent, PageHeader, PageTitle } from '@/components'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetProjectQuery } from '../../api'
import {
  ProjectBudgetView,
  ProjectInsights,
  ProjectTeamView,
  ProjectWidget,
} from '../../components'
import { ProjectTab } from '@/stores/slices/filters/project'
import { ProjectTimeView } from '../../components/Views/Time'

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

  const { projectId } = useParams()

  const { data: project, isLoading } = useGetProjectQuery(projectId!, {
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
      </PageHeader>
      <PageContent className="space-y-5">
        <ProjectInsights />

        <ProjectWidget />

        <ProjectView />
      </PageContent>
    </Page>
  )
}
