import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
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
  Form,
} from '@/components'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import { ModalFooter } from '@/components/Modal'
import { ConfirmationModal } from '@/components/Modals'
import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'
import { useToast } from '@/hooks/useToast'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useDeleteBudgetMutation, useGetBudgetQuery, useUpdateBudgetMutation } from '../../../api'
import { BudgetFormFields, budgetFormSchema } from '../BudgetForm'
import { FixedBudgetSection } from '../BudgetForm/Sections/FixedBudget'
import { NonBillableSection } from '../BudgetForm/Sections/NonBillable'
import { VariableBudgetSection } from '../BudgetForm/Sections/VariableBudget'
import { convertToPennies, convertToPounds } from '@/helpers/currency'
import { convertMinutesToHours } from '@/helpers/date'
import { match } from 'ts-pattern'

type UpdateBudgetFormProps = {
  onClose: () => void
  budgetId: number | null
}

export const UpdateBudgetForm = ({ onClose, budgetId }: UpdateBudgetFormProps): JSX.Element => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { successToast, errorToast } = useToast()

  const { data: budget, isFetching: fetchingBudget } = useGetBudgetQuery(budgetId ?? skipToken)

  const [triggerDelete, { isLoading: deletingBudget }] = useDeleteBudgetMutation()

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
      .then(() => successToast('Budget has been deleted'))
      .catch(() => errorToast('Unable to delete budget, please try again later.'))

    setOpenConfirmationModal(false)
    setTimeout(() => onClose(), 100)
  }

  const onFormChange = (data: BudgetFormFields, methods: UseFormReturn<BudgetFormFields>) => {
    const { watch, setValue } = methods
    if (
      watch('billableType') !== BillableType.TOTAL_COST &&
      watch('budgetType') === BudgetType.FIXED
    ) {
      setValue('hourlyRate', null)
    }
  }

  if (fetchingBudget) {
    return (
      <div className="absolute inset-0 grid place-content-center">
        <Spinner className="text-purple-90 w-10 h-10" />
      </div>
    )
  }

  return (
    <>
      <Form<BudgetFormFields, typeof budgetFormSchema>
        onSubmit={onSubmit}
        queryError={updateErrors}
        onChange={onFormChange}
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
        className="space-y-6"
        validationSchema={budgetFormSchema}
      >
        {(methods) => (
          <>
            <div className="flex gap-6">
              <FormControl className="flex-grow">
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormInput
                  name="name"
                  placeHolder="Enter name"
                  error={!!methods.formState.errors?.name?.message}
                />
                {methods.formState.errors?.name?.message && (
                  <FormErrorMessage>{methods.formState.errors?.name?.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl className="w-fit">
                <FormLabel htmlFor="colour">Colour</FormLabel>
                <ColourPicker name="colour" control={methods.control} />
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
              {match(methods.watch('budgetType'))
                .with(BudgetType.VARIABLE, () => (
                  <VariableBudgetSection
                    control={methods.control}
                    watch={methods.watch}
                    errors={methods.formState.errors}
                  />
                ))
                .with(BudgetType.FIXED, () => (
                  <FixedBudgetSection
                    control={methods.control}
                    watch={methods.watch}
                    errors={methods.formState.errors}
                  />
                ))
                .with(BudgetType.NON_BILLABLE, () => (
                  <NonBillableSection errors={methods.formState.errors} />
                ))
                .exhaustive()}
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
          </>
        )}
      </Form>

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
