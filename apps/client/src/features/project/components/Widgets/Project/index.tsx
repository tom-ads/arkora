import { Button, HorizontalDivider, TabGroup, TabItem } from '@/components'
import { CreateBudgetModal } from '@/features/budget'
import { ProjectTab, setFilters } from '@/stores/slices/filters/project'
import { RootState } from '@/stores/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProjectTimeEntryFilters } from '../../Filters'

export const ProjectWidget = (): JSX.Element => {
  const dispatch = useDispatch()

  const [openActionModal, setOpenActionModal] = useState(false)

  const { selectedTab } = useSelector((state: RootState) => ({
    selectedTab: state.projectFilters.tab,
  }))

  const handleTab = (tab: ProjectTab) => {
    dispatch(setFilters({ tab }))
  }

  return (
    <div className="bg-white rounded shadow-glow py-6">
      <div className="flex justify-between px-5">
        <TabGroup className="gap-x-5">
          <TabItem
            size="md"
            isActive={selectedTab === 'budgets'}
            onClick={() => handleTab('budgets')}
          >
            Budgets
          </TabItem>
          <TabItem
            size="md"
            isActive={selectedTab === 'entries'}
            onClick={() => handleTab('entries')}
          >
            Time
          </TabItem>
          <TabItem size="md" isActive={selectedTab === 'team'} onClick={() => handleTab('team')}>
            Team
          </TabItem>
        </TabGroup>
        <Button
          size="xs"
          onClick={() => setOpenActionModal(true)}
          className="min-h-[36px] py-0 mb-2 text-[14px] -translate-y-1 max-w-[180px]"
          block
        >
          Create Budget
        </Button>
      </div>

      <HorizontalDivider />

      <div className="px-5 pt-4">{selectedTab === 'entries' && <ProjectTimeEntryFilters />}</div>

      <CreateBudgetModal
        isOpen={openActionModal && selectedTab === 'budgets'}
        onClose={() => setOpenActionModal(false)}
      />
    </div>
  )
}
