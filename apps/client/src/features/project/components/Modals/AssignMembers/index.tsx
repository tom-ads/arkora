import { Button } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useGetAccountsQuery } from '@/features/account'
import { useCreateProjectMemberMutation } from '@/features/project'
import { AssignMembersFields, AssignMembersForm } from '@/features/team'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { differenceBy } from 'lodash'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

export const AssignProjectMemberModal = ({ isOpen, onClose }: ModalBaseProps): JSX.Element => {
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null)

  const { projectId } = useParams()

  const { successToast, errorToast } = useToast()

  const [assignProjectMembers] = useCreateProjectMemberMutation()

  const { data: members } = useGetAccountsQuery(
    {
      search: debouncedSearch,
      status: 'INVITE_ACCEPTED',
    },
    { skip: !projectId },
  )

  const { data: projectMembers } = useGetAccountsQuery(
    {
      projectId,
      status: 'INVITE_ACCEPTED',
    },
    { skip: !projectId },
  )

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

  const unassignedMembers = useMemo(() => {
    return differenceBy(members ?? [], projectMembers ?? [], 'id')
  }, [members, projectMembers])

  return (
    <Modal title="Assign Members" isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <AssignMembersForm
        onSubmit={onSubmit}
        onSearch={(search) => setDebouncedSearch(search)}
        value={unassignedMembers ?? []}
      >
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
