import { Button, DoubleCashIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { ModalBaseProps } from '@/types'
import { UpdateBudgetForm } from '../../Forms/UpdateBudget'
import { useToast } from '@/hooks/useToast'
import { useDeleteBudgetMutation, useGetBudgetQuery, useUpdateBudgetMutation } from './../../../api'
import BudgetType from '@/enums/BudgetType'
import { BudgetFormFields } from '../../Forms'
import BillableType from '@/enums/BillableType'
import { convertToPennies, convertToPounds } from '@/helpers/currency'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { convertMinutesToHours } from '@/helpers/date'
import { ConfirmationModal } from '@/components/Modals'

type ManageBudgetModalProps = ModalBaseProps & {
  budgetId: number | null
}

export const ManageBudgetModal = ({
  budgetId,
  isOpen,
  onClose,
}: ManageBudgetModalProps): JSX.Element => {
  const navigate = useNavigate()

  const { successToast, errorToast } = useToast()

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { data: budget, isLoading: loadingBudget } = useGetBudgetQuery(budgetId ?? skipToken)

  const [triggerDelete, { isLoading: deletingBudget, isSuccess: isDeleted }] =
    useDeleteBudgetMutation()

  const [triggerUpdate, { isLoading: updatingBudget, error: updateErrors }] =
    useUpdateBudgetMutation()

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

    switch (data.budgetType) {
      case BudgetType.VARIABLE:
        data.fixedPrice = null
        break
      case BudgetType.FIXED:
        if (data.billableType === BillableType.TOTAL_COST) {
          data.budget = 0
        } else {
          data.hourlyRate = null
        }
        break
      case BudgetType.NON_BILLABLE:
        data.hourlyRate = null
        data.fixedPrice = null
        break
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
    await triggerDelete(budgetId!)
      .then(() => successToast('Budget has been removed'))
      .catch(() => errorToast('Unable to remove budget, please try again later.'))

    setOpenConfirmationModal(false)
  }

  const handleConfirmationLeave = () => {
    if (isDeleted) {
      onClose()
    }
  }

  const handleBudgetLeave = () => {
    if (isDeleted) {
      navigate(`/projects/${budget?.projectId}`)
    }
  }

  return (
    <>
      <Modal
        title="Manage Budget"
        description="Manage budget costs and tracking"
        icon={<DoubleCashIcon />}
        isOpen={isOpen}
        onClose={onClose}
        afterLeave={handleBudgetLeave}
        loading={loadingBudget}
        className="max-w-[655px]"
      >
        <UpdateBudgetForm
          onClose={onClose}
          budgetId={budgetId}
          onSubmit={onSubmit}
          error={updateErrors}
          defaultValues={{
            name: budget?.name ?? '',
            colour: budget?.colour ?? '',
            private: budget?.private ?? false,
            fixedPrice: budget?.fixedPrice ? convertToPounds(budget.fixedPrice) : undefined,
            budgetType: budget?.budgetType?.name ?? BudgetType.VARIABLE,
            billableType: budget?.billableType?.name ?? BillableType.TOTAL_COST,
            budget:
              budget?.budgetType?.name === BudgetType.NON_BILLABLE ||
              budget?.billableType?.name === BillableType.TOTAL_HOURS
                ? convertMinutesToHours(budget?.allocatedDuration ?? 0)
                : convertToPounds(budget?.allocatedBudget ?? 0),
            hourlyRate: budget?.hourlyRate ? convertToPounds(budget.hourlyRate) : undefined,
          }}
        >
          <ModalFooter className="mb-4">
            <Button
              variant="blank"
              onClick={() => setOpenConfirmationModal(true)}
              disabled={updatingBudget || deletingBudget}
              danger
            >
              Delete
            </Button>
            <Button
              size="xs"
              type="submit"
              className="max-w-[161px]"
              loading={updatingBudget || deletingBudget}
            >
              Update Budget
            </Button>
          </ModalFooter>
        </UpdateBudgetForm>
      </Modal>

      <ConfirmationModal
        afterLeave={handleConfirmationLeave}
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={onConfirm}
        loading={deletingBudget}
        title="You're about to remove a budget"
        btnText="Remove Budget"
        description="Performing this action will permanently remove all related tasks, members and tracked time associated with this budget. It cannot be recovered."
      />
    </>
  )
}
