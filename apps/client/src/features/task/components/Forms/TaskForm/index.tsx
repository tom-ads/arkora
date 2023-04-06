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
import { TaskFormFields } from './../../../types'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode } from 'react'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'

export const taskSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  isBillable: z.boolean(),
})

type TaskFormProps = {
  onSubmit?: (data: TaskFormFields, methods?: UseFormReturn<TaskFormFields>) => void
  defaultValues: TaskFormFields
  queryError?: FetchBaseQueryError | SerializedError | undefined
  children: ReactNode
}

export const TaskForm = ({
  onSubmit,
  defaultValues,
  queryError,
  children,
}: TaskFormProps): JSX.Element => {
  return (
    <Form<TaskFormFields, typeof taskSchema>
      mode="onSubmit"
      onSubmit={onSubmit}
      className="space-y-6"
      queryError={queryError}
      validationSchema={taskSchema}
      defaultValues={defaultValues}
    >
      {({ formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput name="name" placeHolder="Enter name" error={!!errors.name?.message} />
            {errors.name?.message && <FormErrorMessage>{errors.name?.message}</FormErrorMessage>}
          </FormControl>

          <FormControl className="!mb-[165px]">
            <FormLabel htmlFor="isBillable">Type</FormLabel>
            <FormStyledRadio className="flex-col sm:flex-row" name="isBillable">
              <FormStyledRadioOption
                title="Billable"
                icon={<DoubleCashIcon className="stroke-[2px]" />}
                description="All time tracked against this task is billed to the client."
                value={true}
              />
              <FormStyledRadioOption
                title="Non-Billable"
                icon={<DoubleCashIcon className="stroke-[2px]" />}
                description="All time tracked against this task is not billed to the client."
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
