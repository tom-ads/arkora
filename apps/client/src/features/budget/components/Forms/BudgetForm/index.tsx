import {
  Form,
  FormControl,
  FormInput,
  FormLabel,
  FormStyledRadio,
  HorizontalDivider,
  LockIcon,
  OpenLockIcon,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import BillableType from '@/enums/BillableType'
import BudgetType from '@/enums/BudgetType'
import {
  validateBudgetField,
  validateFixedPriceField,
  validateHourlyRateField,
} from '@/helpers/validation/fields'
import hourlyRateSchema from '@/helpers/validation/hourly_rate'
import validationIssuer from '@/helpers/validation/issuer'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { FixedBudgetSection } from './Sections/FixedBudget'
import { NonBillableSection } from './Sections/NonBillable'
import { VariableBudgetSection } from './Sections/VariableBudget'

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
  hourlyRate: number | undefined
  fixedPrice: number | undefined
  billableType: BillableType
}

const budgetSchema = z
  .object({
    budgetType: z.nativeEnum(BudgetType),
    billableType: z.nativeEnum(BillableType),
    budget: z.number().optional(),
    fixedPrice: z.number().optional(),
    hourlyRate: hourlyRateSchema.optional(),
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

const budgetFormSchema = z
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
  const [sectionTransition, setSectionTransition] = useState<{
    type: BudgetType
    canTransition: boolean
  }>({ type: BudgetType.VARIABLE, canTransition: true })

  const onChange = (fields: BudgetFormFields, methods: UseFormReturn<BudgetFormFields>) => {
    if (sectionTransition.type !== fields.budgetType) {
      methods.resetField('hourlyRate')
      methods.resetField('budget')
      if (sectionTransition.type === BudgetType.FIXED) {
        methods.resetField('fixedPrice')
      }

      methods.clearErrors()

      setSectionTransition({
        type: fields.budgetType,
        canTransition: false,
      })
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
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput name="name" placeHolder="Enter name" error={!!errors?.name?.message} />
            {errors?.name?.message && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
          </FormControl>

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
            <VariableBudgetSection
              show={watch('budgetType') === BudgetType.VARIABLE && sectionTransition.canTransition}
              control={control}
              watch={watch}
              errors={errors}
              afterLeave={() => setSectionTransition((s) => ({ ...s, canTransition: true }))}
            />

            <FixedBudgetSection
              show={watch('budgetType') === BudgetType.FIXED && sectionTransition.canTransition}
              control={control}
              watch={watch}
              errors={errors}
              afterLeave={() => setSectionTransition((s) => ({ ...s, canTransition: true }))}
            />

            <NonBillableSection
              show={
                watch('budgetType') === BudgetType.NON_BILLABLE && sectionTransition.canTransition
              }
              errors={errors}
              afterLeave={() => setSectionTransition((s) => ({ ...s, canTransition: true }))}
            />
          </div>

          {children}
        </>
      )}
    </Form>
  )
}
