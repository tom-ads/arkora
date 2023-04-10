import { ConfirmationModal } from '@/components/Modals'
import { useDeleteBudgetMemberMutation } from '@/features/budget_members'
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BudgetMembersTable } from '../../Tables'

export const BudgetMemberView = (): JSX.Element => {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { budgetId } = useParams()

  const { successToast, errorToast } = useToast()

  const [triggerDelete, { isLoading }] = useDeleteBudgetMemberMutation()

  const handleDelete = async () => {
    if (budgetId && deleteId) {
      await triggerDelete({ budgetId, memberId: deleteId })
        .unwrap()
        .then(() => successToast('Budget member has been removed'))
        .catch(() => errorToast('Unable to remove member, please try again later.'))

      setDeleteId(null)
    }
  }

  return (
    <>
      <BudgetMembersTable onDelete={(id) => setDeleteId(id)} />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="You're about to remove a member"
        btnText="Remove Member"
        loading={isLoading}
        description="Performing this action will permanently remove this member from this budget and time entries will be deleted. It cannot be recovered."
      />
    </>
  )
}
