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
import hourlyRateSchema from '@/helpers/validation/hourly_rate'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode, useState } from 'react'
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

  billableType: {
    id: BillableType | undefined
    value: BillableType | undefined
    children: string | undefined
  }
  budgetType: BudgetType
  fixedCost: number | undefined
  budget: number | undefined
  hourlyRate: number | undefined
}

const budgetSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  colour: z.string(),
  private: z.boolean(),
  budgetType: z.nativeEnum(BudgetType),
  budget: z
    .number({ required_error: 'Budget is required' })
    .min(1, { message: 'Budget is required' }),
  hourlyRate: hourlyRateSchema,
  billableType: z.object({
    id: z.nativeEnum(BillableType),
    value: z.nativeEnum(BillableType),
    children: z.string(),
  }),
})

type BudgetFormProps = {
  isOpen: boolean
  children?: ReactNode
  defaultValues?: BudgetFormFields
  error?: FetchBaseQueryError | SerializedError
  onSubmit: (data: BudgetFormFields) => void
}

export const BudgetForm = ({
  isOpen,
  onSubmit,
  error,
  defaultValues,
  children,
}: BudgetFormProps): JSX.Element => {
  const [sectionTransition, setSectionTransition] = useState<{
    type: BudgetType
    canTransition: boolean
  }>({ type: BudgetType.VARIABLE, canTransition: true })

  const onChange = (fields: BudgetFormFields) => {
    if (sectionTransition.type !== fields.budgetType) {
      setSectionTransition({
        type: fields.budgetType,
        canTransition: false,
      })
    }
  }

  return (
    <Form<BudgetFormFields, typeof budgetSchema>
      onSubmit={onSubmit}
      queryError={error}
      onChange={onChange}
      defaultValues={defaultValues}
      validationSchema={budgetSchema}
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
            <FormStyledRadio name="private">
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

          <FormStyledRadio name="budgetType" className="gap-[6px]">
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
