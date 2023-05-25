import { Button, ClipboardIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { ConfirmationModal } from '@/components/Modals'
import {
  useDeleteBudgetTaskMutation,
  useGetBudgetTaskQuery,
  useUpdateBudgetTaskMutation,
} from '@/features/budget_tasks'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BudgetTaskForm, BudgetTaskFormFields } from '../../Forms'

type ManageBudgetModalProps = ModalBaseProps & {
  taskId: number | null
}

export const ManageBudgetTaskModal = ({
  taskId,
  isOpen,
  onClose,
}: ManageBudgetModalProps): JSX.Element => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { budgetId } = useParams()

  const { successToast, errorToast } = useToast()

  const {
    data: budgetTask,
    isLoading: fetchingBudgetTask,
    isError,
  } = useGetBudgetTaskQuery(
    { budgetId: budgetId!, taskId: taskId! },
    { skip: !budgetId || !taskId },
  )

  const [updateBudgetTask, { isLoading: updatingTask, error: updateError }] =
    useUpdateBudgetTaskMutation()

  const [deleteBudgetTask, { isLoading: deletingTask }] = useDeleteBudgetTaskMutation()

  const onSubmit = async (data: BudgetTaskFormFields) => {
    if (budgetId && taskId) {
      await updateBudgetTask({
        budgetId,
        taskId,
        ...data,
      })
        .unwrap()
        .then(() => successToast('Budget task has been updated'))
        .catch(() => errorToast('Unable to update budget task, please try again later.'))

      onClose()
    }
  }

  const onConfirm = async () => {
    if (budgetId && taskId) {
      await deleteBudgetTask({ budgetId, taskId })
        .unwrap()
        .then(() => successToast('Budget task has been deleted'))
        .catch(() => errorToast('We failed to delete the budget task, please try again later.'))

      setOpenConfirmationModal(false)
      setTimeout(() => onClose(), 100)
    }
  }

  useEffect(() => {
    if (isError) {
      errorToast('We failed to fetch the budget task, please try again later.')
      onClose()
    }
  }, [isError])

  return (
    <>
      <Modal
        title="Manage Task"
        description="Update task configuration"
        icon={<ClipboardIcon />}
        isOpen={isOpen}
        onClose={onClose}
        loading={fetchingBudgetTask}
        className="max-w-[500px]"
      >
        <BudgetTaskForm
          onSubmit={onSubmit}
          queryError={updateError}
          defaultValues={{
            name: budgetTask?.name ?? '',
            isBillable: budgetTask?.isBillable ?? false,
          }}
        >
          <ModalFooter className="!mt-32">
            <Button
              variant="blank"
              onClick={() => setOpenConfirmationModal(true)}
              disabled={deletingTask || updatingTask}
              danger
            >
              Delete
            </Button>
            <Button
              size="xs"
              type="submit"
              className="max-w-[161px]"
              loading={updatingTask}
              disabled={deletingTask}
            >
              Update Task
            </Button>
          </ModalFooter>
        </BudgetTaskForm>
      </Modal>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={onConfirm}
        loading={deletingTask}
        title="You're about to remove a task"
        btnText="Remove Task"
        description="Performing this action will permanently remove all tracked time against this task. It cannot be recovered."
      />
    </>
  )
}
