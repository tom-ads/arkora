import { Button, HorizontalDivider, TabGroup, TabItem } from '@/components'
import { AssignBudgetMemberModal } from '@/features/budget_members'
import { BudgetTab, setFilters } from '@/stores/slices/filters/budgets'
import { RootState } from '@/stores/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CreateBudgetTaskModal } from '../../Modals'

export const BudgetControlsWidget = (): JSX.Element => {
  const dispatch = useDispatch()

  const [openActionModal, setOpenActionModal] = useState(false)

  const { selectedTab } = useSelector((state: RootState) => ({
    selectedTab: state.budgetFilters.tab,
  }))

  const handleSelectedTab = (tab: BudgetTab) => {
    dispatch(setFilters({ tab }))
  }

  return (
    <>
      <div className="bg-white rounded shadow-glow py-6">
        <div className="flex justify-between px-5">
          <TabGroup className="gap-x-5">
            <TabItem
              size="md"
              isActive={selectedTab === 'tasks'}
              onClick={() => handleSelectedTab('tasks')}
            >
              Tasks
            </TabItem>
            <TabItem
              size="md"
              isActive={selectedTab === 'members'}
              onClick={() => handleSelectedTab('members')}
            >
              Members
            </TabItem>
          </TabGroup>

          <Button
            size="xs"
            onClick={() => setOpenActionModal(true)}
            className="min-h-[36px] py-0 mb-2 text-[14px] -translate-y-1 max-w-[180px]"
            block
          >
            {selectedTab === 'tasks' && <span>Create Task</span>}
            {selectedTab === 'members' && <span>Assign Members</span>}
          </Button>
        </div>

        <HorizontalDivider />

        <div className="px-5 pt-4 h-[58px]"></div>
      </div>

      <CreateBudgetTaskModal
        isOpen={openActionModal && selectedTab === 'tasks'}
        onClose={() => setOpenActionModal(false)}
      />

      <AssignBudgetMemberModal
        isOpen={openActionModal && selectedTab === 'members'}
        onClose={() => setOpenActionModal(false)}
      />
    </>
  )
}
