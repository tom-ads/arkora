import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  Button,
  ColourPicker,
  FormControl,
  FormInput,
  FormLabel,
  FormStyledRadio,
  HorizontalDivider,
  LockIcon,
  OpenLockIcon,
  Spinner,
  FormErrorMessage,
} from '@/components'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import { ModalFooter } from '@/components/Modal'
import { ConfirmationModal } from '@/components/Modals'
import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'
import { useToast } from '@/hooks/useToast'
import { skipToken } from '@reduxjs/toolkit/dist/query'

import { useDeleteBudgetMutation, useGetBudgetQuery, useUpdateBudgetMutation } from '../../../api'
import { BudgetFormFields } from '../BudgetForm'
import { FixedBudgetSection } from '../BudgetForm/Sections/FixedBudget'
import { NonBillableSection } from '../BudgetForm/Sections/NonBillable'
import { VariableBudgetSection } from '../BudgetForm/Sections/VariableBudget'
import { convertToPennies, convertToPounds } from '@/helpers/currency'
import { useQueryError } from '@/hooks/useQueryError'

type UpdateBudgetFormProps = {
  onClose: () => void
  budgetId: number | null
}

export const UpdateBudgetForm = ({ onClose, budgetId }: UpdateBudgetFormProps): JSX.Element => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { successToast, errorToast } = useToast()

  const { data: budget, isFetching: fetchingBudget } = useGetBudgetQuery(budgetId ?? skipToken)

  const [triggerDelete, { isLoading: deletingBudget }] = useDeleteBudgetMutation()

  const [triggerUpdate, { isLoading: updatingBudget, error }] = useUpdateBudgetMutation()

  const methods = useForm<BudgetFormFields>({
    defaultValues: {
      name: '',
      colour: '',
      private: true,
      fixedPrice: undefined,
      budgetType: BudgetType.VARIABLE,
      billableType: BillableType.TOTAL_COST,
      budget: undefined,
      hourlyRate: undefined,
    },
  })

  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods

  useQueryError<BudgetFormFields>({ setError: methods.setError, error })

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
      .then(() => successToast('Budget has been deleted'))
      .catch(() => errorToast('Unable to delete budget, please try again later.'))

    setOpenConfirmationModal(false)
    onClose()
  }

  useEffect(() => {
    if (budget) {
      setValue('name', budget.name)
      setValue('budgetType', budget.budgetType.name)
      setValue('billableType', budget.billableType.name)
      setValue('colour', budget.colour)
      setValue('private', budget.private)
      setValue(
        'budget',
        budget.budgetType?.name === BudgetType.NON_BILLABLE
          ? budget.totalMinutes / 60
          : convertToPounds(budget.totalCost),
      )
      setValue('hourlyRate', budget.hourlyRate ? convertToPounds(budget.hourlyRate) : undefined)
      setValue('fixedPrice', budget.fixedPrice ? convertToPounds(budget.fixedPrice) : undefined)
    }
  }, [budget])

  useEffect(() => {
    if (budget?.billableType?.name !== getValues('billableType')) {
      setValue('hourlyRate', null)
    }
  }, [watch('billableType'), budget])

  if (fetchingBudget) {
    return (
      <div className="absolute inset-0 grid place-content-center">
        <Spinner className="text-purple-90 w-10 h-10" />
      </div>
    )
  }

  return (
    <>
      <FormProvider {...methods}>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-6">
            <FormControl className="flex-grow">
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormInput name="name" placeHolder="Enter name" error={!!errors?.name?.message} />
              {errors?.name?.message && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>

            <FormControl className="w-fit">
              <FormLabel htmlFor="colour">Colour</FormLabel>
              <ColourPicker name="colour" control={control} />
            </FormControl>
          </div>

          <FormControl>
            <FormLabel htmlFor="private">Visibility</FormLabel>
            <FormStyledRadio className="flex-col sm:flex-row" name="private">
              <FormStyledRadioOption
                title="Public"
                icon={<OpenLockIcon className="stroke-[2px]" />}
                description="All assigned project members will be able to view this budget"
                value={false}
              />
              <FormStyledRadioOption
                title="Private"
                icon={<LockIcon className="stroke-[2px]" />}
                description="Only assigned project members will be able to view this budget"
                value={true}
              />
            </FormStyledRadio>
          </FormControl>

          <HorizontalDivider
            contentLeft={
              <p className="whitespace-nowrap font-medium text-base text-gray-100">Budget Type</p>
            }
          />

          <FormStyledRadio name="budgetType" className="flex-col sm:flex-row gap-[6px]">
            <FormStyledRadioOption
              title="Variable"
              description="Est. budget. Charge and track by the hour. Can overrun."
              value={BudgetType.VARIABLE}
            />
            <FormStyledRadioOption
              title="Fixed"
              description="Set budget or cost. Tracked by the hour, cannot overrun"
              value={BudgetType.FIXED}
            />
            <FormStyledRadioOption
              title="Non-Billable"
              description="No cost, budget hours only. Track by hour, can overrun."
              value={BudgetType.NON_BILLABLE}
            />
          </FormStyledRadio>

          <div className="min-h-[210px]">
            {watch('budgetType') === BudgetType.VARIABLE && (
              <VariableBudgetSection control={control} watch={watch} errors={errors} />
            )}

            {watch('budgetType') === BudgetType.FIXED && (
              <FixedBudgetSection control={control} watch={watch} errors={errors} />
            )}

            {watch('budgetType') === BudgetType.NON_BILLABLE && (
              <NonBillableSection errors={errors} />
            )}
          </div>

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
        </form>
      </FormProvider>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={onConfirm}
        loading={deletingBudget}
        title="You're about to delete a budget"
        btnText="Delete Budget"
        description="Performing this action will permanently delete all related tasks, members and tracked time associated with this budget. It cannot be recovered."
      />
    </>
  )
}
