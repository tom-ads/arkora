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
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'

type FormFields = {
  tasks: Task[]
}

const validationSchema = z.object({})

type BudgetTasksTableProps = {
  onManage: (taskId: number) => void
}

export const BudgetTasksTable = ({ onManage }: BudgetTasksTableProps): JSX.Element => {
  const { budgetId } = useParams()

  const authRole = useSelector((state: RootState) => state.auth.user?.role?.name)

  const { data: tasks, isLoading } = useGetBudgetTasksQuery(parseInt(budgetId!, 10), {
    skip: !budgetId,
  })

  return (
    <TableContainer
      emptyState={{
        isEmpty: !tasks?.length && !isLoading,
        icon: <ClipboardIcon />,
        title: 'No Tasks',
        btnText: 'Create Task',
        description:
          'Budget tasks define what is considered billable and non-billable for each time entry created against this budget',
      }}
    >
      <Form<FormFields, typeof validationSchema> defaultValues={{ tasks: tasks ?? [] }}>
        {() => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeading className="w-[400px]" first>
                  NAME
                </TableHeading>
                <TableHeading className="w-[100px]">SPENT</TableHeading>
                <TableHeading className="w-[100px]">BILLABLE</TableHeading>
                <TableHeading className="w-[50px]" last></TableHeading>
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
