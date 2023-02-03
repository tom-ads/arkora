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
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetProjectQuery } from '../../api'

export const ProjectPage = (): JSX.Element => {
  const [openCreateBudgetModal, setOpenCreateBudgetModal] = useState(false)

  const { projectId } = useParams()

  const { data: project } = useGetProjectQuery(projectId ?? skipToken)

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Projects</PageTitle>
          <PageDescription>Manage your organisations projects and view insights</PageDescription>
        </div>
      </PageHeader>
      <PageContent>
        <Card>
          <Button size="xs" onClick={() => setOpenCreateBudgetModal(true)}>
            Create Budget
          </Button>
        </Card>
      </PageContent>
      <CreateBudgetModal
        isOpen={openCreateBudgetModal}
        onClose={() => setOpenCreateBudgetModal(false)}
      />
    </Page>
  )
}
