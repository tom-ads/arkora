import { Form, FormControl, FormInput, FormLabel } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { ModalBaseProps } from '@/types'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { z } from 'zod'

export type ClientFormFields = {
  name: string
}

const clientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

type ClientFormProps = ModalBaseProps & {
  onSubmit: (data: ClientFormFields) => void
  defaultValues?: ClientFormFields
  error?: FetchBaseQueryError | SerializedError
  children: JSX.Element
}

export const ClientForm = ({
  onSubmit,
  error,
  defaultValues,
  children,
}: ClientFormProps): JSX.Element => {
  return (
    <Form<ClientFormFields, typeof clientSchema>
      onSubmit={onSubmit}
      validationSchema={clientSchema}
      queryError={error}
      defaultValues={defaultValues}
    >
      {({ formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput name="name" placeHolder="Enter a name" error={!!errors.name?.message} />
            {errors?.name?.message && <FormErrorMessage>{errors.name?.message}</FormErrorMessage>}
          </FormControl>

          {children}
        </>
      )}
    </Form>
  )
}
