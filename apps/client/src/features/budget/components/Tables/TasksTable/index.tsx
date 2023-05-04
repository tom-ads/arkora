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
import { useGetBudgetTasksQuery } from '@/features/budget_tasks'
import Task from '@/types/models/Task'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { BudgetTaskRow, BudgetTaskSkeletonRow } from '../TasksRow'

type FormFields = {
  tasks: Task[]
}

const validationSchema = z.object({})

type BudgetTasksTableProps = {
  onManage: (taskId: number) => void
}

export const BudgetTasksTable = ({ onManage }: BudgetTasksTableProps): JSX.Element => {
  const { budgetId } = useParams()

  const { data: tasks, isLoading } = useGetBudgetTasksQuery(parseInt(budgetId!, 10), {
    skip: !budgetId,
  })

  return (
    <TableContainer
      className="min-h-[768px]"
      emptyState={{
        isEmpty: !tasks?.length && !isLoading,
        icon: <ClipboardIcon />,
        title: 'No Tasks',
        btnText: 'Create Task',
        description:
          'Tasks represent different services and billability of tracked time against the budget',
      }}
    >
      <Form<FormFields, typeof validationSchema> defaultValues={{ tasks: tasks ?? [] }}>
        {() => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeading first>NAME</TableHeading>
                <TableHeading>SPENT</TableHeading>
                <TableHeading>BILLABLE</TableHeading>
                <TableHeading className="w-10" last></TableHeading>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <BudgetTaskSkeletonRow key={idx} />
                  ))}
                </>
              ) : (
                <>
                  {tasks?.map((task) => (
                    <BudgetTaskRow key={task.id} value={task} onManage={onManage} />
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
