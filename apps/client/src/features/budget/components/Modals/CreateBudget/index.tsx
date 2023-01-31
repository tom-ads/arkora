import { Button, DoubleCashIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import BudgetType from '@/enums/BudgetType'
import { useCreateBudgetMutation } from './../../../api'
import { ModalBaseProps } from '@/types'
import { useParams } from 'react-router-dom'
import { BudgetForm, BudgetFormFields } from '../../Forms'
import { useToast } from '@/hooks/useToast'
import BillableType from '@/enums/BillableType'

type CreateBudgetModalProps = ModalBaseProps

export const CreateBudgetModal = ({
  isOpen,
  onClose,
  loading,
}: CreateBudgetModalProps): JSX.Element => {
  const { projectId } = useParams()

  const { successToast, errorToast } = useToast()

  const [createBudget, { isLoading: creatingBudget, reset: resetMutation, error }] =
    useCreateBudgetMutation()

  const reset = () => {
    resetMutation()
    onClose()
  }

  const onSubmit = async (data: BudgetFormFields) => {
    if (projectId) {
      await createBudget({
        project_id: parseInt(projectId, 10),
        name: data.name,
        private: data.private,
        colour: data.colour,
        budget: data.budget ?? 0,
        billable_type: data.billableType.id,
        budget_type: data.budgetType,
        fixed_price: data.fixedPrice,
        hourly_rate: data.hourlyRate,
      })
        .unwrap()
        .then(() => {
          successToast('Budget has been created')
          reset()
        })
        .catch((error) => {
          if (error.status === 422) return

          reset()
          errorToast('Unable to create budget, please try again later.')
        })
    }
  }

  return (
    <Modal
      title="Create Budget"
      description="Setup costs and tracking methods for this budget"
      icon={<DoubleCashIcon />}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[655px]"
    >
      <BudgetForm
        isOpen={isOpen}
        onSubmit={onSubmit}
        error={error}
        defaultValues={{
          name: '',
          colour: '#FFFFFF',
          private: true,
          fixedPrice: undefined,
          budgetType: BudgetType.VARIABLE,
          billableType: {
            id: BillableType.TOTAL_COST,
            value: BillableType.TOTAL_COST,
            children: 'Total Budget Cost',
          },
          budget: undefined,
          hourlyRate: undefined,
        }}
      >
        <ModalFooter className="mb-4">
          <Button variant="blank" onClick={onClose}>
            Cancel
          </Button>
          <Button size="xs" type="submit" loading={creatingBudget} className="max-w-[161px] w-full">
            Create Budget
          </Button>
        </ModalFooter>
      </BudgetForm>
    </Modal>
  )
}
