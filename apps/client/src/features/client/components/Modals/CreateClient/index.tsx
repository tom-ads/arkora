import { Button, UserIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useCreateClientMutation } from '../../../api'
import { ModalBaseProps } from '@/types'
import { ClientForm, ClientFormFields } from '../../Forms'
import { useToast } from '@/hooks/useToast'

type CreateClientModalProps = ModalBaseProps

export const CreateClientModal = (props: CreateClientModalProps): JSX.Element => {
  const { successToast, errorToast } = useToast()

  const [createClient, { error: createClientError }] = useCreateClientMutation()

  const handleSubmit = async (data: ClientFormFields) => {
    await createClient(data)
      .unwrap()
      .then(() => {
        successToast('Client has been created')
        props.onClose()
      })
      .catch((error) => {
        if (error.status === 422) return
        errorToast('Unable to create client, please try again later.')
        props.onClose()
      })
  }

  return (
    <Modal
      title="Create Client"
      description="Setup a new client"
      icon={<UserIcon />}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ClientForm
        {...props}
        error={createClientError}
        onSubmit={handleSubmit}
        defaultValues={{
          name: '',
        }}
      >
        <ModalFooter className="!mt-56">
          <Button variant="blank" onClick={props.onClose}>
            Cancel
          </Button>
          <Button size="xs" type="submit" className="max-w-[161px] w-full">
            Create Client
          </Button>
        </ModalFooter>
      </ClientForm>
    </Modal>
  )
}
