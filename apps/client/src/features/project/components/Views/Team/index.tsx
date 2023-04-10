import { MembersTable } from '../../Tables/MembersTable'
import { ConfirmationModal } from '@/components/Modals'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { useDeleteProjectMemberMutation } from '@/features/project_members'

export const ProjectTeamView = (): JSX.Element => {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { projectId } = useParams()

  const { successToast, errorToast } = useToast()

  const [triggerDelete, { isLoading }] = useDeleteProjectMemberMutation()

  const handleDelete = async () => {
    if (projectId && deleteId) {
      await triggerDelete({ projectId, memberId: deleteId })
        .unwrap()
        .then(() => successToast('Project member has been removed'))
        .catch(() => errorToast('Unable to remove member, please try again later.'))

      setDeleteId(null)
    }
  }

  return (
    <>
      <MembersTable onDelete={(memberId) => setDeleteId(memberId)} />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="You're about to remove a member"
        btnText="Remove Member"
        loading={isLoading}
        description="Performing this action will permanently remove this member from the projects budgets and time entries will be deleted. It cannot be recovered."
      />
    </>
  )
}
