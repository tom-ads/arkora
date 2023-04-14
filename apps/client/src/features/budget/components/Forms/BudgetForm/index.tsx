import {
  ColourPicker,
  Form,
  FormControl,
  FormInput,
  FormLabel,
  FormStyledRadio,
  HorizontalDivider,
  LockIcon,
  OpenLockIcon,
  FormErrorMessage,
} from '@/components'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'
import {
  validateBudgetField,
  validateFixedPriceField,
  validateHourlyRateField,
} from '@/helpers/validation/fields'
import validationIssuer from '@/helpers/validation/issuer'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode, useState } from 'react'
import { z } from 'zod'
import { FixedBudgetSection } from './Sections/FixedBudget'
import { NonBillableSection } from './Sections/NonBillable'
import { VariableBudgetSection } from './Sections/VariableBudget'
import { match } from 'ts-pattern'
import { UseFormReturn } from 'react-hook-form'

export const billableTypeOption = [
  {
    id: BillableType.TOTAL_COST,
    value: BillableType.TOTAL_COST,
    display: 'Total Budget Cost',
  },
  {
    id: BillableType.TOTAL_HOURS,
    value: BillableType.TOTAL_HOURS,
    display: 'Total Budget Hours',
  },
]

export type BudgetFormFields = {
  name: string
  colour: string
  private: boolean
  budgetType: BudgetType
  budget: number | undefined
  hourlyRate: number | null | undefined
  fixedPrice: number | null | undefined
  billableType: BillableType
}

export const budgetSchema = z
  .object({
    budgetType: z.nativeEnum(BudgetType),
    billableType: z.nativeEnum(BillableType),
    budget: z.number().nullable().optional(),
    fixedPrice: z.number().nullable().optional(),
    hourlyRate: z.number().nullable().optional(),
  })
  .superRefine(({ budgetType, billableType, budget, fixedPrice, hourlyRate }, ctx) => {
    const budgetResult = validateBudgetField(budget)
    const fixedPriceResult = validateFixedPriceField(fixedPrice)
    const hourlyRateResult = validateHourlyRateField(hourlyRate)

    if (budgetType === BudgetType.VARIABLE) {
      validationIssuer('budget', budgetResult, ctx)
      validationIssuer('hourlyRate', hourlyRateResult, ctx)
    }

    if (budgetType === BudgetType.FIXED) {
      billableType === BillableType.TOTAL_HOURS
        ? validationIssuer('budget', budgetResult, ctx)
        : validationIssuer('hourlyRate', hourlyRateResult, ctx)

      validationIssuer('fixedPrice', fixedPriceResult, ctx)
    }

    if (budgetType === BudgetType.NON_BILLABLE) {
      validationIssuer('budget', budgetResult, ctx)
    }
  })

export const budgetFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    colour: z.string(),
    private: z.boolean(),
  })
  .and(budgetSchema)

type BudgetFormProps = {
  children?: ReactNode
  defaultValues?: BudgetFormFields
  error?: FetchBaseQueryError | SerializedError
  onSubmit: (data: BudgetFormFields) => void
}

export const BudgetForm = ({
  onSubmit,
  error,
  defaultValues,
  children,
}: BudgetFormProps): JSX.Element => {
  const [previousState, setPreviousState] = useState<Partial<BudgetFormFields>>({
    budgetType: BudgetType.VARIABLE,
    billableType: BillableType.TOTAL_COST,
  })

  const onChange = (fields: BudgetFormFields, methods: UseFormReturn<BudgetFormFields>) => {
    if (previousState.budgetType !== fields.budgetType) {
      methods.resetField('budget')

      if (previousState.budgetType === BudgetType.FIXED) {
        methods.resetField('fixedPrice')
      }

      if (previousState.budgetType !== BudgetType.NON_BILLABLE) {
        methods.resetField('hourlyRate')
        methods.resetField('billableType')
      }

      methods.clearErrors()

      setPreviousState(fields)
    }

    if (
      previousState.budgetType === BudgetType.FIXED &&
      previousState.billableType !== fields.billableType
    ) {
      methods.resetField('hourlyRate')
      methods.resetField('budget')
      methods.clearErrors(['hourlyRate', 'budget'])

      setPreviousState(fields)
    }
  }

  return (
    <Form<BudgetFormFields, typeof budgetFormSchema>
      onSubmit={onSubmit}
      queryError={error}
      onChange={onChange}
      defaultValues={defaultValues}
      validationSchema={budgetFormSchema}
      className="space-y-6"
    >
      {({ control, watch, formState: { errors } }) => (
        <>
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
            {match(watch('budgetType'))
              .with(BudgetType.VARIABLE, () => (
                <VariableBudgetSection control={control} watch={watch} errors={errors} />
              ))
              .with(BudgetType.FIXED, () => (
                <FixedBudgetSection control={control} watch={watch} errors={errors} />
              ))
              .with(BudgetType.NON_BILLABLE, () => <NonBillableSection errors={errors} />)
              .exhaustive()}
          </div>

          {children}
        </>
      )}
    </Form>
  )
}
