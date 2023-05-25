import {
  BinIcon,
  Button,
  FormCheckbox,
  PlusIcon,
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeading,
  TableRow,
} from '@/components'
import { OrganisationWithTasksFormFields } from '@/features/organisation'
import { CreateDefaultTaskModal } from '@/features/task'
import { TaskFormFields } from '@/features/task'
import { ModalBaseProps } from '@/types'
import { useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

type OrganisationTasksViewProps = ModalBaseProps & UseFormReturn<OrganisationWithTasksFormFields>

export const OrganisationTasksView = ({ control }: OrganisationTasksViewProps): JSX.Element => {
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false)

  const { fields, append, remove } = useFieldArray<OrganisationWithTasksFormFields, 'defaultTasks'>(
    {
      name: 'defaultTasks',
      control,
    },
  )

  const handleAddTask = (data: TaskFormFields, methods?: UseFormReturn<TaskFormFields>) => {
    const nameExists = fields.some((task) => task.name?.toLowerCase() === data.name?.toLowerCase())
    if (nameExists) {
      methods?.setError('name', { message: 'Task name already exists' })
      return
    }

    append(data)
    setOpenCreateTaskModal(false)
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-100">Default Tasks</p>
        </div>
        <p className="text-gray-80 text-sm">
          These tasks are automatically assigned to newly created budgets
        </p>
      </div>

      <Button
        block
        size="xs"
        variant="outlined"
        className="min-h-[10px] !py-[10px]"
        onClick={() => setOpenCreateTaskModal(true)}
      >
        <div className="flex items-center gap-x-2">
          <PlusIcon className="w-5 h-5 shrink-0" />
          <span className="text-sm">Add Default Task</span>
        </div>
      </Button>

      <Table>
        <TableHead className="!bg-white border-y border-y-gray-40">
          <TableRow>
            <TableHeading className="w-[350px]">Name</TableHeading>
            <TableHeading className="w-20">Billable</TableHeading>
            <TableHeading className="w-[44px]"></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields?.map((task, taskIdx) => (
            <TableRow key={task.id}>
              <TableData className="!py-4">{task.name}</TableData>

              <TableData className="!py-4">
                <FormCheckbox name={`defaultTasks.${taskIdx}.isBillable`} />
              </TableData>

              <TableData className="!py-4">
                <Button variant="blank" className="min-h-0" onClick={() => remove(taskIdx)}>
                  <BinIcon className="w-5 text-red-90 hover:text-red-40 focus:text-red-90 focus-visible:text-red-40" />
                </Button>
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateDefaultTaskModal
        isOpen={openCreateTaskModal}
        onClose={() => setOpenCreateTaskModal(false)}
        onSubmit={handleAddTask}
      />
    </div>
  )
}
