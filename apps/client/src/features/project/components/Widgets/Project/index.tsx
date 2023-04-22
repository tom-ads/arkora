import { Button, HorizontalDivider, TabGroup, TabItem } from '@/components'
import { CreateBudgetModal } from '@/features/budget'
import { ProjectTab, setFilters } from '@/stores/slices/filters/project'
import { RootState } from '@/stores/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProjectTimeEntryFilters } from '../../Filters'
import { AssignProjectMemberModal } from '../../Modals/AssignMembers'
import UserRole from '@/enums/UserRole'

export const ProjectWidget = (): JSX.Element => {
  const dispatch = useDispatch()

  const [openActionModal, setOpenActionModal] = useState(false)

  const { selectedTab, authRole } = useSelector((state: RootState) => ({
    selectedTab: state.projectFilters.tab,
    authRole: state.auth.user?.role?.name,
  }))

  const handleSelectedTab = (tab: ProjectTab) => {
    dispatch(setFilters({ tab }))
  }

  return (
    <div className="bg-white rounded shadow-glow py-6">
      <div className="flex justify-between px-5">
        <TabGroup className="gap-x-5">
          <TabItem
            size="md"
            isActive={selectedTab === 'budgets'}
            onClick={() => handleSelectedTab('budgets')}
          >
            Budgets
          </TabItem>
          <TabItem
            size="md"
            isActive={selectedTab === 'entries'}
            onClick={() => handleSelectedTab('entries')}
          >
            Time
          </TabItem>
          <TabItem
            size="md"
            isActive={selectedTab === 'team'}
            onClick={() => handleSelectedTab('team')}
          >
            Team
          </TabItem>
        </TabGroup>
        {selectedTab !== 'entries' && authRole !== UserRole.MEMBER && (
          <Button
            size="xs"
            onClick={() => setOpenActionModal(true)}
            className="min-h-[36px] py-0 mb-2 text-[14px] -translate-y-1 max-w-[180px]"
            block
          >
            {selectedTab === 'budgets' && <span>Create Budget</span>}
            {selectedTab === 'team' && <span>Assign Members</span>}
          </Button>
        )}
      </div>

      <HorizontalDivider />

      <div className="px-5 pt-4 h-[58px]">
        {selectedTab === 'entries' && <ProjectTimeEntryFilters />}
      </div>

      <CreateBudgetModal
        isOpen={openActionModal && selectedTab === 'budgets'}
        onClose={() => setOpenActionModal(false)}
      />

      <AssignProjectMemberModal
        isOpen={openActionModal && selectedTab === 'team'}
        onClose={() => setOpenActionModal(false)}
      />
    </div>
  )
}
