import { Button } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { TaskFormFields } from './../../../types'
import { ModalBaseProps } from '@/types'
import { TaskForm } from '../../Forms/TaskForm'
import { UseFormReturn } from 'react-hook-form'

type CreateCommonTaskModalProps = ModalBaseProps & {
  onSubmit: (data: TaskFormFields, methods?: UseFormReturn<TaskFormFields>) => void
}

export const CreateDefaultTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateCommonTaskModalProps): JSX.Element => {
  return (
    <Modal title="Add Default Task" isOpen={isOpen} onClose={onClose} className="min-h-[400px]">
      <div className="space-y-6">
        <TaskForm
          onSubmit={onSubmit}
          defaultValues={{
            name: '',
            isBillable: false,
          }}
        >
          <ModalFooter className="mb-4">
            <Button variant="blank" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="xs" className="max-w-[160px]">
              Add Task
            </Button>
          </ModalFooter>
        </TaskForm>
      </div>
    </Modal>
  )
}
