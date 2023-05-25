import {
  ClipboardIcon,
  Form,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
} from '@/components'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { BudgetNote } from '@/types/models/BugetNote'
import { useGetBudgetNotesQuery } from '@/features/budget_notes'
import { BudgetNoteRow, BudgetNotesSkeletonRow } from '../NoteRow'

type FormFields = {
  notes: BudgetNote[]
}

const validationSchema = z.object({})

type BudgetTasksTableProps = {
  onManage: (taskId: number) => void
}

export const BudetNotesTable = ({ onManage }: BudgetTasksTableProps): JSX.Element => {
  const { budgetId } = useParams()

  const { data: notes, isLoading } = useGetBudgetNotesQuery(parseInt(budgetId!, 10), {
    skip: !budgetId,
  })

  return (
    <TableContainer
      className="min-h-[768px]"
      emptyState={{
        isEmpty: !notes?.length && !isLoading,
        icon: <ClipboardIcon />,
        title: 'No Notes',
        btnText: 'Create Note',
        description: 'Notes help keep track of budget information for all managers to see.',
      }}
    >
      <Form<FormFields, typeof validationSchema> defaultValues={{ notes: notes ?? [] }}>
        {() => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeading first>NAME</TableHeading>
                <TableHeading>Description</TableHeading>
                <TableHeading>Created</TableHeading>
                <TableHeading className="w-10" last></TableHeading>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <BudgetNotesSkeletonRow key={idx} />
                  ))}
                </>
              ) : (
                <>
                  {notes?.map((note) => (
                    <BudgetNoteRow key={note.id} value={note} onManage={onManage} />
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        )}
      </Form>
    </TableContainer>
  )
}
