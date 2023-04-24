import { CostBreakdownWidget } from '@/components'
import { useGetProjectInsightsQuery, useGetProjectQuery } from './../../../api'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import UserRole from '@/enums/UserRole'
import Status from '@/enums/Status'

export const ProjectInsights = (): JSX.Element => {
  const { projectId } = useParams()

  const authRole = useSelector((state: RootState) => state.auth.user?.role?.name)

  const { data: project } = useGetProjectQuery(parseInt(projectId!, 10), { skip: !projectId })

  const { data: insights } = useGetProjectInsightsQuery(parseInt(projectId!, 10), {
    skip: !projectId,
  })

  return (
    <CostBreakdownWidget
      value={{
        allocatedBudget: insights?.allocatedBudget ?? 0,
        allocatedDuration: insights?.allocatedDuration ?? 0,
        billableCost: insights?.billableCost ?? 0,
        billableDuration: insights?.billableDuration ?? 0,
        unbillableCost: insights?.unbillableCost ?? 0,
        unbillableDuration: insights?.unbillableDuration ?? 0,
        private: project?.private,
        status: project?.status as Status | undefined,
        // Members cannot view cost related information if project sets it to hidden
        showCost: authRole === UserRole.MEMBER ? project?.showCost : true,
      }}
    />
  )
}
