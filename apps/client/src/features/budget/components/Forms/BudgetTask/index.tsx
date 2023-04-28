import {
  DoubleCashIcon,
  Form,
  FormControl,
  FormErrorMessage,
  FormInput,
  FormLabel,
  FormStyledRadio,
} from '@/components'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode } from 'react'
import { z } from 'zod'

export type BudgetTaskFormFields = {
  name: string
  isBillable: boolean
}

const budgetTaskSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  isBillable: z.boolean(),
})

type BudgetTaskFormProps = {
  onSubmit: (data: BudgetTaskFormFields) => void
  defaultValues: BudgetTaskFormFields
  queryError: FetchBaseQueryError | SerializedError | undefined
  children: ReactNode
}

export const BudgetTaskForm = ({
  onSubmit,
  defaultValues,
  queryError,
  children,
}: BudgetTaskFormProps): JSX.Element => {
  return (
    <Form<BudgetTaskFormFields, typeof budgetTaskSchema>
      onSubmit={onSubmit}
      className="space-y-6"
      queryError={queryError}
      validationSchema={budgetTaskSchema}
      defaultValues={defaultValues}
    >
      {({ formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput name="name" placeHolder="Enter name" error={!!errors.name?.message} />
            {errors.name?.message && <FormErrorMessage>{errors.name?.message}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="private">Type</FormLabel>
            <FormStyledRadio className="flex-col sm:flex-row" name="isBillable">
              <FormStyledRadioOption
                title="Billable"
                icon={<DoubleCashIcon className="stroke-[2px]" />}
                description="Tracked time against this task are billable to the client."
                value={true}
              />
              <FormStyledRadioOption
                title="Non-Billable"
                icon={<DoubleCashIcon className="stroke-[2px]" />}
                description="Tracked time against this task are not billable to the client."
                value={false}
              />
            </FormStyledRadio>
          </FormControl>

          {children}
        </>
      )}
    </Form>
  )
}
