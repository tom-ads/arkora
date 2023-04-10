import { Button } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useGetAccountsQuery } from '@/features/account'
import {
  useCreateProjectMembersMutation,
  useGetProjectMembersQuery,
} from '@/features/project_members'
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

  const [assignProjectMembers, { isLoading: assigningMembers }] = useCreateProjectMembersMutation()

  const { data: organisationMembers } = useGetAccountsQuery(
    { search: debouncedSearch, status: 'INVITE_ACCEPTED' },
    { skip: !projectId },
  )

  const { data: projectMembers } = useGetProjectMembersQuery(
    { projectId: projectId!, search: debouncedSearch },
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
    return differenceBy(organisationMembers ?? [], projectMembers ?? [], 'id')
  }, [organisationMembers, projectMembers])

  return (
    <Modal title="Assign Members" isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <AssignMembersForm
        onSubmit={onSubmit}
        onSearch={(search) => setDebouncedSearch(search)}
        value={unassignedMembers ?? []}
      >
        <ModalFooter>
          <Button variant="blank" onClick={onClose} disabled={assigningMembers}>
            Cancel
          </Button>
          <Button size="xs" type="submit" loading={assigningMembers}>
            Assign Members
          </Button>
        </ModalFooter>
      </AssignMembersForm>
    </Modal>
  )
}
