import { Button, UserIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useDeleteClientMutation, useGetClientQuery, useUpdateClientMutation } from '../../../api'
import { ModalBaseProps } from '@/types'
import { ClientForm, ClientFormFields } from '../../Forms'
import { useToast } from '@/hooks/useToast'
import { useParams } from 'react-router-dom'
import { ConfirmationModal } from '@/components/Modals'
import { useState } from 'react'

type ManageClientModalProps = ModalBaseProps

export const ManageClientModal = (props: ManageClientModalProps): JSX.Element => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { successToast, errorToast } = useToast()

  const { clientId } = useParams()

  const { data: client, isFetching: fetchingClient } = useGetClientQuery(parseInt(clientId!, 10), {
    skip: !clientId,
  })

  const [updateClient, { error: updateClientError, isLoading: updatingClient }] =
    useUpdateClientMutation()

  const [deleteClient, { isLoading: deletingClient }] = useDeleteClientMutation()

  const handleSubmit = async (data: ClientFormFields) => {
    await updateClient({ id: parseInt(clientId!, 10), ...data })
      .unwrap()
      .then(() => {
        successToast('Client has been updated')
        props.onClose()
      })
      .catch((error) => {
        if (error.status === 422) return
        errorToast('Unable to update client, please try again later.')
        props.onClose()
      })
  }

  const handleConfirm = async () => {
    await deleteClient(parseInt(clientId!, 10))
      .then(() => successToast('Client has been removed'))
      .catch((error) => {
        if (error.status === 422) return
        errorToast('Unable to remove client, please try again later.')
      })

    setOpenConfirmationModal(false)
    setTimeout(() => props.onClose(), 100)
  }

  return (
    <Modal
      title="Manage Client"
      description="Update client information"
      icon={<UserIcon />}
      isOpen={props.isOpen}
      onClose={props.onClose}
      loading={fetchingClient}
      className="max-w-[500px]"
    >
      <ClientForm
        {...props}
        error={updateClientError}
        onSubmit={handleSubmit}
        defaultValues={{ name: client?.name ?? '' }}
      >
        <ModalFooter className="!mt-56">
          <Button
            danger
            variant="blank"
            disabled={updatingClient}
            onClick={() => setOpenConfirmationModal(true)}
          >
            Remove
          </Button>
          <Button size="xs" type="submit" className="max-w-[161px] w-full" loading={updatingClient}>
            Update Client
          </Button>
        </ModalFooter>
      </ClientForm>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleConfirm}
        loading={deletingClient}
        title="You're about to remove a client"
        btnText="Remove Client"
        description="Performing this action will permanently remove all projects, budgets and time entries associated with this client. It cannot be recovered."
      />
    </Modal>
  )
}
