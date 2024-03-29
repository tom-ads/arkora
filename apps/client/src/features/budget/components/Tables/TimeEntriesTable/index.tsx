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
import { useParams } from 'react-router-dom'
import { TimeEntriesRow, TimeEntriesSkeletonRow } from '../TimeEntriesRow'

type TableProps = {
  onManage: (id: number) => void
}

export const TimeEntriesTable = ({ onManage }: TableProps): JSX.Element => {
  const { budgetId } = useParams()

  const { data: projectEntries, isLoading } = useGetTimeEntriesQuery(
    { budgets: [budgetId!] },
    { skip: !budgetId },
  )

  return (
    <TableContainer
      className="min-h-[768px]"
      emptyState={{
        isEmpty: !projectEntries?.length && !isLoading,
        title: 'No Entries',
        description:
          'When budget members track their time against this budget you will see their entries here',
        icon: <ClockIcon />,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading first></TableHeading>
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
