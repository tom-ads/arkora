import { Table, TableBody, TableContainer, TableHead, TableHeading, TableRow } from '@/components'
import { useGetTimeEntriesQuery } from '@/features/time_entry'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TimeEntryRow, TimeEntrySkeletonRow } from '../Rows/TimeEntryRow'

export const TimeEntryTable = (): JSX.Element => {
  const { projectId } = useParams()

  const { membersFilter, billableFilter } = useSelector((state: RootState) => ({
    membersFilter: state.projectFilters.timeEntry.members,
    billableFilter: state.projectFilters.timeEntry.billable,
  }))

  const { data: projectEntries, isLoading } = useGetTimeEntriesQuery(
    {
      project_id: parseInt(projectId!, 10),
      billable: billableFilter,
      members: membersFilter,
    },
    { skip: !projectId },
  )

  return (
    <TableContainer className="min-h-[768px]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-0 !px-2" first></TableHeading>
            <TableHeading className="w-[160px]">NAME</TableHeading>
            <TableHeading className="w-[160px]">BUDGET</TableHeading>
            <TableHeading className="w-[300px]">DESCRIPTION</TableHeading>
            <TableHeading className="w-[100px]">Date</TableHeading>
            <TableHeading className="w-[100px]">ESTIMATE</TableHeading>
            <TableHeading className="w-[100px]">TIME</TableHeading>
            <TableHeading className="w-[65px]">BILLABLE</TableHeading>
            <TableHeading className="w-0 !px-2" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, idx) => (
                <TimeEntrySkeletonRow key={idx} />
              ))}
            </>
          ) : (
            <>
              {projectEntries?.map((entry) => (
                <TimeEntryRow key={entry.id} value={entry} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
