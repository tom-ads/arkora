import { Button, Page, PageBackBtn, PageContent, PageHeader, PageTitle } from '@/components'
import { BudgetTab } from '@/stores/slices/filters/budgets'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetBudgetQuery } from '../../api'
import { BudgetMemberView, BudgetTaskView, BudgetTimeView } from '../../components/Views'
import { BudgetControlsWidget } from '../../components/Widgets/BudgetControls'
import { BudgetCostInsights, ManageBudgetModal } from '../../components'
import { BudgetNoteView } from '../../components/Views/NoteView'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useState } from 'react'
import { useAuthorization } from '@/hooks/useAuthorization'

const views = {
  tasks: <BudgetTaskView />,
  time: <BudgetTimeView />,
  members: <BudgetMemberView />,
  notes: <BudgetNoteView />,
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

  const { checkPermission } = useAuthorization()

  const [openManageBudgetModal, setOpenManageBudgetModal] = useState<boolean>(false)

  const { data: budget } = useGetBudgetQuery(parseInt(budgetId!, 10)!, { skip: !budgetId })

  return (
    <Page>
      <PageBackBtn to={`/projects/${budget?.projectId}`}>Back to Project</PageBackBtn>
      <PageHeader>
        <div>
          <p className="text-xl text-gray-40 font-medium">Budget</p>
          <PageTitle>{budget?.name}</PageTitle>
        </div>
        {checkPermission('project:update') && (
          <Button variant="secondary" size="xs" onClick={() => setOpenManageBudgetModal(true)}>
            Manage Budget
          </Button>
        )}
      </PageHeader>
      <PageContent className="space-y-5">
        <BudgetCostInsights />

        <BudgetControlsWidget />

        <BudgetView />
      </PageContent>

      <ManageBudgetModal
        budgetId={budgetId ? parseInt(budgetId!, 10) : null}
        isOpen={openManageBudgetModal}
        onClose={() => setOpenManageBudgetModal(false)}
      />
    </Page>
  )
}
