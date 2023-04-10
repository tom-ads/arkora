import { Button } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useCreateBudgetMemberMutation, useGetBudgetMembersQuery } from './../../../api'
import { AssignMembersFields, AssignMembersForm } from '@/features/team'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { differenceBy } from 'lodash'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetBudgetQuery } from '@/features/budget'
import { useGetProjectMembersQuery } from '@/features/project_members'

export const AssignBudgetMemberModal = ({ isOpen, onClose }: ModalBaseProps): JSX.Element => {
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null)

  const { budgetId } = useParams()

  const { successToast, errorToast } = useToast()

  const [assignMembers] = useCreateBudgetMemberMutation()

  const { data: budget } = useGetBudgetQuery(budgetId!, { skip: !budgetId })

  const { data: projectMembers } = useGetProjectMembersQuery(
    { projectId: budget?.projectId as number, search: debouncedSearch },
    { skip: !budget?.projectId },
  )

  const { data: budgetMembers } = useGetBudgetMembersQuery(
    { budgetId: budgetId! },
    { skip: !budgetId },
  )

  const onSubmit = async (data: AssignMembersFields) => {
    if (budgetId) {
      await assignMembers({
        budgetId,
        members: data.members.map((member) => member.id),
      })
        .unwrap()
        .then(() => successToast('Budget members have been assigned'))
        .catch(() => errorToast('Unable to assign budget members, please try again later'))

      onClose()
    }
  }

  const unassignedMembers = useMemo(() => {
    return differenceBy(projectMembers ?? [], budgetMembers ?? [], 'id')
  }, [projectMembers, budgetMembers])

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
