import {
  ClockIcon,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
} from '@/components'
import { useGetTimeEntriesQuery } from '@/features/entry'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TimeEntriesRow, TimeEntriesSkeletonRow } from '../TimeEntriesRow'
import UserRole from '@/enums/UserRole'

type TableProps = {
  onManage: (id: number) => void
}

export const TimeEntriesTable = ({ onManage }: TableProps): JSX.Element => {
  const { projectId } = useParams()

  const { tasksFilter, budgetsFilter, membersFilter, billableFilter, authRole } = useSelector(
    (state: RootState) => ({
      tasksFilter: state.projectFilters.timeEntry.tasks,
      budgetsFilter: state.projectFilters.timeEntry.budgets,
      membersFilter: state.projectFilters.timeEntry.members,
      billableFilter: state.projectFilters.timeEntry.billable,
      authRole: state.auth.user?.role?.name,
    }),
  )

  const { data: projectEntries, isLoading } = useGetTimeEntriesQuery(
    {
      projectId,
      billable: billableFilter,
      budgets: budgetsFilter,
      members: membersFilter,
      tasks: tasksFilter,
    },
    { skip: !projectId },
  )

  return (
    <TableContainer
      className="min-h-[768px]"
      emptyState={{
        isEmpty: !projectEntries?.length && !isLoading,
        title: 'No Entries Found',
        description:
          authRole === UserRole.MEMBER
            ? 'Your tracked time for this project will display here once you track some time!'
            : 'When project members track their time against the projects budgets you will see their entries here',
        icon: <ClockIcon />,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading first></TableHeading>
            <TableHeading>BUDGET</TableHeading>
            <TableHeading>DESCRIPTION</TableHeading>
            <TableHeading>Date</TableHeading>
            <TableHeading>ESTIMATE</TableHeading>
            <TableHeading>TIME</TableHeading>
            <TableHeading>BILLABLE</TableHeading>
            <TableHeading className="w-10" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, idx) => (
                <TimeEntriesSkeletonRow key={idx} />
              ))}
            </>
          ) : (
            <>
              {projectEntries?.map((entry) => (
                <TimeEntriesRow key={entry.id} value={entry} onManage={onManage} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
