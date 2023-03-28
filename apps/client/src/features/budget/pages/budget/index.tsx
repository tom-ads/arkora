import { Page, PageBackBtn, PageContent, PageHeader, PageTitle } from '@/components'
import { BudgetTab } from '@/stores/slices/filters/budgets'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetBudgetQuery } from '../../api'
import { BudgetTaskView } from '../../components/Views'
import { BudgetControlsWidget } from '../../components/Widgets/BudgetControls'

const views = {
  tasks: <BudgetTaskView />,
}

const BudgetView = () => {
  const { selectedTab } = useSelector((state: RootState) => ({
    selectedTab: state.budgetFilters.tab,
  }))

  return views[selectedTab as BudgetTab]
}

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
        <BudgetControlsWidget />

        <BudgetView />
      </PageContent>
    </Page>
  )
}
