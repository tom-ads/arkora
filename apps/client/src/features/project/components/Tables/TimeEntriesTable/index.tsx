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

type TableProps = {
  onManage: (id: number) => void
}

export const TimeEntriesTable = ({ onManage }: TableProps): JSX.Element => {
  const { projectId } = useParams()

  const { tasksFilter, budgetsFilter, membersFilter, billableFilter } = useSelector(
    (state: RootState) => ({
      tasksFilter: state.projectFilters.timeEntry.tasks,
      budgetsFilter: state.projectFilters.timeEntry.budgets,
      membersFilter: state.projectFilters.timeEntry.members,
      billableFilter: state.projectFilters.timeEntry.billable,
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
          'When project members track their time against the projects budgets you will see their entries here',
        icon: <ClockIcon />,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[160px]" first>
              NAME
            </TableHeading>
            <TableHeading className="w-[190px]">BUDGET</TableHeading>
            <TableHeading className="w-[270px]">DESCRIPTION</TableHeading>
            <TableHeading className="w-[90px]">Date</TableHeading>
            <TableHeading className="w-[80px]">ESTIMATE</TableHeading>
            <TableHeading className="w-[80px]">TIME</TableHeading>
            <TableHeading className="w-[65px]">BILLABLE</TableHeading>
            <TableHeading className="w-[65px]" last></TableHeading>
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
