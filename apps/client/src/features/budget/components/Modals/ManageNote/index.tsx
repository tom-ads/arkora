import { Button } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { useParams } from 'react-router-dom'
import {
  useDeleteBudgetNoteMutation,
  useGetBudgetNoteQuery,
  useUpdateBudgetNoteMutation,
} from '@/features/budget_notes'
import { BudgetNoteForm, BudgetNoteFormFields } from '../../Forms/BudgetNote'
import { ConfirmationModal } from '@/components/Modals'
import { useState } from 'react'

type ManageBudgetNoteModalProps = ModalBaseProps & {
  noteId: number | null
}

export const ManageBudgetNoteModal = ({
  isOpen,
  onClose,
  noteId,
}: ManageBudgetNoteModalProps): JSX.Element => {
  const { budgetId } = useParams()

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { data: note, isLoading: loadingNote } = useGetBudgetNoteQuery(
    { budgetId: parseInt(budgetId!, 10), noteId: noteId! },
    { skip: !noteId || !budgetId },
  )

  const [updateNote, { isLoading: updatingNote, error }] = useUpdateBudgetNoteMutation()

  const [deleteNote, { isLoading: deletingNote }] = useDeleteBudgetNoteMutation()

  const { successToast, errorToast } = useToast()

  const handleSubmit = async (data: BudgetNoteFormFields) => {
    if (budgetId && noteId) {
      await updateNote({ budgetId: parseInt(budgetId!, 10), noteId, ...data })
        .unwrap()
        .then(() => {
          onClose()
          successToast('Budget note has been updated')
        })
        .catch((err) => {
          if (err.status === 422) return
          errorToast('Unable to update budget note, please try again later.')
          onClose()
        })
    }
  }

  const onConfirm = async () => {
    await deleteNote({ budgetId: parseInt(budgetId!, 10), noteId: noteId! })
      .then(() => successToast('Note has been removed'))
      .catch(() => errorToast('Unable to remove note, please try again later.'))

    setOpenConfirmationModal(false)
    setTimeout(() => onClose(), 100)
  }

  return (
    <>
      <Modal
        title="Update Note"
        isOpen={isOpen}
        onClose={onClose}
        loading={loadingNote}
        className="max-w-[500px] min-h-0"
      >
        <BudgetNoteForm
          queryError={error}
          onSubmit={handleSubmit}
          defaultValues={{ note: note?.note ?? '' }}
        >
          <ModalFooter className="mt-14">
            <Button
              danger
              variant="blank"
              onClick={() => setOpenConfirmationModal(true)}
              disabled={updatingNote}
            >
              Remove
            </Button>
            <Button
              size="xs"
              type="submit"
              className="max-w-[161px]"
              loading={updatingNote}
              disabled={deletingNote}
            >
              Update Note
            </Button>
          </ModalFooter>
        </BudgetNoteForm>
      </Modal>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={onConfirm}
        loading={deletingNote}
        title="You're about to remove a note"
        btnText="Delete Note"
        description="Performing this action will permanently remove this note from this budget. It cannot be recovered."
      />
    </>
  )
}
