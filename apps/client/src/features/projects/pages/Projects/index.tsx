import { Page, PageContent, PageDescription, PageTitle } from '@/components'
import { ProjectsTable } from '../../components/Tables/ProjectsTable'

export const ProjectsPage = (): JSX.Element => {
  return (
    <Page>
      <PageTitle>Projects</PageTitle>
      <PageDescription>Manage your organisations projects and view insights</PageDescription>
      <PageContent>
        <ProjectsTable />
      </PageContent>
    </Page>
  )
}
