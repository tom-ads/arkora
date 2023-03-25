import { Page, PageBackBtn, PageContent, PageHeader, PageTitle } from '@/components'
import { useParams } from 'react-router-dom'
import { useGetBudgetQuery } from '../../api'
import { BudgetTasksTable } from '../../components/Tables'

export const BudgetPage = (): JSX.Element => {
  const { budgetId } = useParams()

  const { data: budget } = useGetBudgetQuery(budgetId!, { skip: !budgetId })

  return (
    <Page>
      <PageBackBtn to={`/projects/${budget?.projectId}`}>Back to Project</PageBackBtn>
      <PageHeader>
        <div>
          <PageTitle>{budget?.name}</PageTitle>
        </div>
      </PageHeader>
      <PageContent className="space-y-5">
        <BudgetTasksTable />
      </PageContent>
    </Page>
  )
}
