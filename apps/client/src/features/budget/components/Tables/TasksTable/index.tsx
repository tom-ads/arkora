import {
  Form,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
} from '@/components'
import { useGetTasksQuery } from '@/features/task'
import Task from '@/types/models/Task'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { TasksRow } from '../TasksRow'

type FormFields = {
  tasks: Task[]
}

const validationSchema = z.object({})

export const BudgetTasksTable = (): JSX.Element => {
  const { budgetId } = useParams()

  const { data: tasks, isLoading } = useGetTasksQuery({ budgetId }, { skip: !budgetId })

  return (
    <TableContainer
      emptyState={{
        isEmpty: !tasks?.length && isLoading,
        // icon: <UserIcon />,
        title: 'No Tasks',
        btnText: 'Create Task',
        // onClick: onCreate,
        description:
          'Tasks determine the billable / non-billable of each time entry they create for a budget',
      }}
    >
      <Form<FormFields, typeof validationSchema> defaultValues={{ tasks: tasks ?? [] }}>
        {() => (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeading className="w-[200px]" first>
                  NAME
                </TableHeading>
                <TableHeading className="w-[200px]">SPENT</TableHeading>
                <TableHeading className="w-[150px]">BILLABLE / NON-BILLABLE</TableHeading>
                <TableHeading className="w-[100px]">BILLABLE</TableHeading>
                <TableHeading className="w-[40px]" last></TableHeading>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.map((task) => (
                <TasksRow key={task.id} value={task} itemIdx={task.id} />
              ))}
            </TableBody>
          </Table>
        )}
      </Form>
    </TableContainer>
  )
}
