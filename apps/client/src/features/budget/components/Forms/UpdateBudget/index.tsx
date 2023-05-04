import { ReactNode } from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  ColourPicker,
  FormControl,
  FormInput,
  FormLabel,
  FormStyledRadio,
  HorizontalDivider,
  LockIcon,
  OpenLockIcon,
  FormErrorMessage,
  Form,
} from '@/components'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { BudgetFormFields, budgetFormSchema } from '../BudgetForm'
import { FixedBudgetSection } from '../BudgetForm/Sections/FixedBudget'
import { NonBillableSection } from '../BudgetForm/Sections/NonBillable'
import { VariableBudgetSection } from '../BudgetForm/Sections/VariableBudget'
import { match } from 'ts-pattern'
import { SerializedError } from '@reduxjs/toolkit'

type UpdateBudgetFormProps = {
  budgetId: number | null
  children: ReactNode
  defaultValues?: BudgetFormFields
  error?: FetchBaseQueryError | SerializedError
  onClose: () => void
  onSubmit: (data: BudgetFormFields) => void
}

export const UpdateBudgetForm = ({
  error,
  defaultValues,
  onSubmit,
  children,
}: UpdateBudgetFormProps): JSX.Element => {
  const onFormChange = (_: BudgetFormFields, methods: UseFormReturn<BudgetFormFields>) => {
    const { watch, setValue } = methods
    if (
      watch('billableType') !== BillableType.TOTAL_COST &&
      watch('budgetType') === BudgetType.FIXED
    ) {
      setValue('hourlyRate', null)
    }
  }

  return (
    <Form<BudgetFormFields, typeof budgetFormSchema>
      onSubmit={onSubmit}
      queryError={error}
      onChange={onFormChange}
      defaultValues={defaultValues}
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

          {children}
        </>
      )}
    </Form>
  )
}
