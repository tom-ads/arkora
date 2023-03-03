import { Page, PageContent, PageDescription, PageHeader, PageTitle } from '@/components'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetProjectQuery } from '../../api'
import { ProjectBudgetView, ProjectWidget } from '../../components'
import { ProjectTab } from '@/stores/slices/filters/project'
import { ProjectTimeView } from '../../components/Views/Time'

const views = {
  budgets: <ProjectBudgetView />,
  entries: <ProjectTimeView />,
  team: <></>,
}

const ProjectView = () => {
  const { selectedTab } = useSelector((state: RootState) => ({
    selectedTab: state.projectFilters.tab,
  }))

  return views[selectedTab as ProjectTab]
}

export const ProjectPage = (): JSX.Element => {
  useDocumentTitle('Projects')

  const { projectId } = useParams()

  const { data: project } = useGetProjectQuery(projectId!, {
    skip: !projectId,
  })

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>{project?.name}</PageTitle>
          <PageDescription>Manage your organisations projects and view insights</PageDescription>
        </div>
      </PageHeader>
      <PageContent className="space-y-5">
        <ProjectWidget />

        <ProjectView />
      </PageContent>
    </Page>
  )
}
