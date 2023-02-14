import { Button, DoubleCashIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'
import { useDeleteBudgetMutation, useGetBudgetQuery, useUpdateBudgetMutation } from '../../../'
import { ModalBaseProps } from '@/types'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { BudgetForm, BudgetFormFields } from '../../Forms'
import { useMemo, useState } from 'react'
import { convertToPennies, convertToPounds } from '@/helpers/currency'
import { ConfirmationModal } from '@/components/Modals'
import { useToast } from '@/hooks/useToast'
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
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { successToast, errorToast } = useToast()

  const { data: budget, isFetching: fetchingBudget } = useGetBudgetQuery(budgetId ?? skipToken)

  const [triggerDelete, { isLoading: deletingBudget }] = useDeleteBudgetMutation()

  const [triggerUpdate, { isLoading: updatingBudget, error }] = useUpdateBudgetMutation()

  const onSubmit = async (data: BudgetFormFields) => {
    let actualBudget = data.budget ?? 0

    if (data.budgetType === BudgetType.NON_BILLABLE) {
      actualBudget = data.budget! * 60
    } else if (
      (data.budgetType === BudgetType.VARIABLE || data.budgetType === BudgetType.FIXED) &&
      data.billableType === BillableType.TOTAL_HOURS
    ) {
      actualBudget = data.budget! * 60
    } else {
      actualBudget = convertToPennies(data.budget!)
    }

    if (budget?.projectId && budget.id) {
      await triggerUpdate({
        budget_id: budget.id,
        project_id: budget.projectId,
        name: data.name,
        private: data.private,
        colour: data.colour,
        budget: actualBudget,
        billable_type: data.billableType,
        budget_type: data.budgetType,
        fixed_price: data.fixedPrice ? convertToPennies(data.fixedPrice) : null,
        hourly_rate: data.hourlyRate ? convertToPennies(data.hourlyRate) : null,
      })
        .unwrap()
        .then(() => successToast('Budget has been updated'))
        .catch(() => errorToast('Unable to update budget, please try again later.'))

      onClose()
    }
  }

  const onConfirm = async () => {
    setOpenConfirmationModal(false)

    await triggerDelete(budgetId!)
      .then(() => successToast('Budget has been deleted'))
      .catch(() => errorToast('Unable to delete budget, please try again later.'))

    onClose()
  }

  const formattedBudget = useMemo(() => {
    const formatted = { ...budget }
    if (budget) {
      formatted.totalCost = convertToPounds(budget.totalCost)
      formatted.hourlyRate = convertToPounds(budget.hourlyRate)
      if (budget.fixedPrice) {
        formatted.fixedPrice = convertToPounds(budget.fixedPrice)
      }
    }

    return formatted
  }, [budget])

  return (
    <Modal
      title="Manage Budget"
      description="Manage budget costs and tracking"
      icon={<DoubleCashIcon />}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[655px]"
      loading={fetchingBudget}
    >
      <UpdateBudgetForm onClose={onClose} budgetId={budgetId} />
    </Modal>
  )
}
