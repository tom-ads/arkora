import { Page, PageBackBtn, PageContent, PageHeader, PageTitle } from '@/components'
import { BudgetTab } from '@/stores/slices/filters/budgets'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetBudgetQuery } from '../../api'
import { BudgetMemberView, BudgetTaskView, BudgetTimeView } from '../../components/Views'
import { BudgetControlsWidget } from '../../components/Widgets/BudgetControls'
import { BudgetCostInsights } from '../../components'

const views = {
  tasks: <BudgetTaskView />,
  time: <BudgetTimeView />,
  members: <BudgetMemberView />,
}

const BudgetView = () => {
  const { selectedTab } = useSelector((state: RootState) => ({
    selectedTab: state.budgetFilters.tab,
  }))

  return views[selectedTab as BudgetTab]
}

export const BudgetPage = (): JSX.Element => {
  useDocumentTitle('Budget')

  const { budgetId } = useParams()

  const { data: budget } = useGetBudgetQuery(parseInt(budgetId!, 10)!, { skip: !budgetId })

  return (
    <Page>
      <PageBackBtn to={`/projects/${budget?.projectId}`}>Back to Project</PageBackBtn>
      <PageHeader>
        <div>
          <p className="text-xl text-gray-40 font-medium">Budget</p>
          <PageTitle>{budget?.name}</PageTitle>
        </div>
      </PageHeader>
      <PageContent className="space-y-5">
        <BudgetCostInsights />

        <BudgetControlsWidget />

        <BudgetView />
      </PageContent>
    </Page>
  )
}
