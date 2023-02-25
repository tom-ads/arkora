import { UserIcon } from '@/components'
import { Modal } from '@/components/Modal'
import { ModalBaseProps } from '@/types'
import { InviteMembersForm } from '../../Forms'

type InviteMembersModalProps = ModalBaseProps

export const InviteMembersModal = (props: InviteMembersModalProps): JSX.Element => {
  return (
    <Modal
      title="Invite Members"
      description="Upload or Manually Add Members"
      icon={<UserIcon />}
      isOpen={props.isOpen}
      onClose={props.onClose}
      className="min-h-[700px] h-full"
    >
      <InviteMembersForm {...props} />
    </Modal>
  )
}
