import { Button, ClipboardIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useCreateBudgetTaskMutation } from '@/features/budget_tasks'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { useParams } from 'react-router-dom'
import { BudgetTaskForm, BudgetTaskFormFields } from '../../Forms'

type CreateBudgetTaskModalProps = ModalBaseProps

export const CreateBudgetTaskModal = ({
  isOpen,
  onClose,
}: CreateBudgetTaskModalProps): JSX.Element => {
  const { budgetId } = useParams()

  const [createBudgetTask, { isLoading, error }] = useCreateBudgetTaskMutation()

  const { successToast, errorToast } = useToast()

  const handleSubmit = async (data: BudgetTaskFormFields) => {
    if (budgetId) {
      await createBudgetTask({ budgetId, ...data })
        .unwrap()
        .then(() => {
          onClose()
          successToast('Budget task has been created')
        })
        .catch((err) => {
          if (err.status === 422) return
          errorToast('Unable to create budget task, please try again later.')
          onClose()
        })
    }
  }

  return (
    <Modal
      title="Create Budget Task"
      description="Setup billable or non-billable tasks for a budget"
      icon={<ClipboardIcon />}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] min-h-[600px]"
    >
      <BudgetTaskForm
        queryError={error}
        onSubmit={handleSubmit}
        defaultValues={{ name: '', isBillable: true }}
      >
        <ModalFooter>
          <Button variant="blank" onClick={() => onClose()} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="xs" type="submit" className="max-w-[161px]" loading={isLoading}>
            Create Task
          </Button>
        </ModalFooter>
      </BudgetTaskForm>
    </Modal>
  )
}
