import {
  Button,
  Card,
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components'
import { CreateBudgetModal } from '@/features/budget'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { useGetProjectQuery } from '../../api'

export const ProjectPage = (): JSX.Element => {
  const { projectId } = useParams()

  const { data: project } = useGetProjectQuery(projectId ?? skipToken)

  return (
    <Page>
      <PageHeader>
        <PageTitle>Projects</PageTitle>
        <PageDescription>Manage your organisations projects and view insights</PageDescription>
      </PageHeader>
      <PageContent>
        <Card>
          <Button size="xs">Create Budget</Button>
        </Card>
      </PageContent>
      <CreateBudgetModal
        isOpen={true}
        onClose={() => {
          /* */
        }}
      />
    </Page>
  )
}
