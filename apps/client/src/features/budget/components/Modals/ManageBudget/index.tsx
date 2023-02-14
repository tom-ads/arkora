import { DoubleCashIcon } from '@/components'
import { Modal } from '@/components/Modal'
import { ModalBaseProps } from '@/types'
import { UpdateBudgetForm } from '../../Forms/UpdateBudget'

type ManageBudgetModalProps = ModalBaseProps & {
  budgetId: number | null
  projectId: number | null
}

export const ManageBudgetModal = ({
  budgetId,
  isOpen,
  onClose,
}: ManageBudgetModalProps): JSX.Element => {
  return (
    <Modal
      title="Manage Budget"
      description="Manage budget costs and tracking"
      icon={<DoubleCashIcon />}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[655px]"
    >
      <UpdateBudgetForm onClose={onClose} budgetId={budgetId} />
    </Modal>
  )
}
