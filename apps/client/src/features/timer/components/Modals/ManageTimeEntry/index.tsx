import { Button, ClockIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useDeleteTimerMutation } from '../../../api'
import { ModalBaseProps } from '@/types'
import { TimeEntryForm } from '../../Forms'
import { useToast } from '@/hooks/useToast'
import { ConfirmationModal } from '@/components/Modals'
import { useState } from 'react'

type ManageTimeEntryModal = ModalBaseProps & {
  entryId: number | null
}

export const ManageTimeEntryModal = ({
  entryId,
  isOpen,
  onClose,
}: ManageTimeEntryModal): JSX.Element => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { successToast, errorToast } = useToast()

  const [triggerDelete, { isLoading: deletingEntry }] = useDeleteTimerMutation()

  const onConfirm = async () => {
    setOpenConfirmationModal(false)

    await triggerDelete(entryId!)
      .unwrap()
      .then(() => successToast('Entry has been deleted'))
      .catch(() => errorToast('Unable to delete entry, please try again later.'))

    onClose()
  }

  return (
    <>
      <Modal
        title="Manage Entry"
        description="Manage your time entry"
        icon={<ClockIcon />}
        isOpen={isOpen}
        onClose={onClose}
      >
        <TimeEntryForm isOpen={isOpen} onClose={onClose}>
          <ModalFooter className="!mt-11">
            <Button variant="blank" onClick={() => setOpenConfirmationModal(true)} danger>
              Delete
            </Button>
            <Button size="xs" type="submit" className="max-w-[161px]">
              <span>Update Entry</span>
            </Button>
          </ModalFooter>
        </TimeEntryForm>
      </Modal>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={onConfirm}
        loading={deletingEntry}
        title="You're about to delete a time entry"
        btnText="Delete Entry"
        description="Performing this action will permenently delete all time tracked for this entry. It cannot be recovered."
      />
    </>
  )
}
