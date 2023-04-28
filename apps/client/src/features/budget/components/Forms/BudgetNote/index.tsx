import { Form, FormControl, FormErrorMessage, FormLabel, FormTextArea } from '@/components'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode } from 'react'
import { z } from 'zod'

export type BudgetNoteFormFields = {
  note: string
}

export const budgetNoteValidator = z.object({
  note: z.string().min(1, { message: 'Note is required' }),
})

type BudgetNoteFormProps = {
  children?: ReactNode
  defaultValues?: BudgetNoteFormFields
  queryError?: FetchBaseQueryError | SerializedError
  onSubmit: (data: BudgetNoteFormFields) => void
}

export const BudgetNoteForm = ({
  onSubmit,
  queryError,
  defaultValues,
  children,
}: BudgetNoteFormProps): JSX.Element => {
  return (
    <Form<BudgetNoteFormFields, typeof budgetNoteValidator>
      onSubmit={onSubmit}
      queryError={queryError}
      defaultValues={defaultValues}
      validationSchema={budgetNoteValidator}
    >
      {({ formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="note">Note</FormLabel>
            <FormTextArea name="note" error={!!errors.note?.message} row={4} />
            {!!errors?.note?.message && (
              <FormErrorMessage>{errors?.note?.message}</FormErrorMessage>
            )}
          </FormControl>

          {children}
        </>
      )}
    </Form>
  )
}
