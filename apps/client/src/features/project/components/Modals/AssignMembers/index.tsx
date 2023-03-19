import { Button } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useCreateProjectMemberMutation } from '@/features/project'
import { AssignMembersFields, AssignMembersForm } from '@/features/team'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { useParams } from 'react-router-dom'

type Props = ModalBaseProps

export const AssignProjectMemberModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const { projectId } = useParams()

  const { successToast, errorToast } = useToast()

  const [assignProjectMembers] = useCreateProjectMemberMutation()

  const onSubmit = async (data: AssignMembersFields) => {
    if (projectId) {
      await assignProjectMembers({
        projectId,
        members: data.members.map((member) => member.id),
      })
        .unwrap()
        .then(() => successToast('Project members have been assigned'))
        .catch(() => errorToast('Unable to assign project members, please try again later'))

      onClose()
    }
  }

  return (
    <Modal title="Assign Members" isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <AssignMembersForm onSubmit={onSubmit}>
        <ModalFooter>
          <Button variant="blank" onClick={onClose}>
            Cancel
          </Button>
          <Button size="xs" type="submit">
            Assign Members
          </Button>
        </ModalFooter>
      </AssignMembersForm>
    </Modal>
  )
}
