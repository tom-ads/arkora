import { Button } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { useParams } from 'react-router-dom'
import { useCreateBudgetNoteMutation } from '@/features/budget_notes'
import { BudgetNoteForm, BudgetNoteFormFields } from '../../Forms/BudgetNote'

type CreateBudgetNoteModalProps = ModalBaseProps

export const CreateBudgetNoteModal = ({
  isOpen,
  onClose,
}: CreateBudgetNoteModalProps): JSX.Element => {
  const { budgetId } = useParams()

  const [createNote, { isLoading, error }] = useCreateBudgetNoteMutation()

  const { successToast, errorToast } = useToast()

  const handleSubmit = async (data: BudgetNoteFormFields) => {
    if (budgetId) {
      await createNote({ budgetId: parseInt(budgetId!, 10), ...data })
        .unwrap()
        .then(() => {
          onClose()
          successToast('Note has been created')
        })
        .catch((err) => {
          if (err.status === 422) return
          errorToast('Unable to create note, please try again later.')
          onClose()
        })
    }
  }

  return (
    <Modal title="Create Note" isOpen={isOpen} onClose={onClose} className="max-w-[500px] min-h-0">
      <BudgetNoteForm queryError={error} onSubmit={handleSubmit}>
        <ModalFooter className="mt-14">
          <Button variant="blank" onClick={() => onClose()} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="xs" type="submit" className="max-w-[161px]" loading={isLoading}>
            Create Note
          </Button>
        </ModalFooter>
      </BudgetNoteForm>
    </Modal>
  )
}
