import {
  Button,
  Card,
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components'
import { BudgetsTable, CreateBudgetModal, useGetBudgetsQuery } from '@/features/budget'
import { BudgetRow } from '@/features/budget'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectPage = (): JSX.Element => {
  const [openCreateBudgetModal, setOpenCreateBudgetModal] = useState(false)

  const { projectId } = useParams()

  const { data: projectBudgets } = useGetBudgetsQuery(
    { project_id: parseInt(projectId!, 10) },
    { skip: !projectId },
  )

  return (
    <Page>
      <PageHeader>
        <div>
          <PageTitle>Projects</PageTitle>
          <PageDescription>Manage your organisations projects and view insights</PageDescription>
        </div>
      </PageHeader>
      <PageContent className="space-y-5">
        <Card>
          <Button size="xs" onClick={() => setOpenCreateBudgetModal(true)}>
            Create Budget
          </Button>
        </Card>

        <BudgetsTable>
          {projectBudgets?.map((budget) => (
            <BudgetRow key={budget.id} budget={budget} />
          ))}
        </BudgetsTable>
      </PageContent>
      <CreateBudgetModal
        isOpen={openCreateBudgetModal}
        onClose={() => setOpenCreateBudgetModal(false)}
      />
    </Page>
  )
}
