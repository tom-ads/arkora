import {
  Button,
  Form,
  FormatDateTime,
  FormControl,
  FormErrorMessage,
  FormInput,
  FormLabel,
} from '@/components'
import { ModalFooter } from '@/components/Modal'
import { useUpdateAccountMutation } from './../../../api'
import { useToast } from '@/hooks/useToast'
import { RootState } from '@/stores/store'
import { DateTime } from 'luxon'
import { UseFormReturn } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '@/stores/slices/auth'
import { z } from 'zod'
import { ModalBaseProps } from '@/types'

type FormFields = {
  forename: string
  surname: string
  email: string
}

const formSchema = z.object({
  forename: z
    .string()
    .min(1, { message: 'Forename is required' })
    .regex(/^([^0-9]+)$/, { message: 'Forename cannot contain numbers' }),
  surname: z
    .string()
    .min(1, { message: 'Surname is required' })
    .regex(/^([^0-9]+)$/, { message: 'Surname cannot contain numbers' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email address' }),
})

export const ProfileDetailsView = (props: ModalBaseProps) => {
  const dispatch = useDispatch()

  const { organisation, authUser } = useSelector((state: RootState) => ({
    organisation: state.organisation,
    authUser: state.auth.user,
  }))

  const { successToast, errorToast } = useToast()

  const [updateDetails, { isLoading, error }] = useUpdateAccountMutation()

  const onSubmit = async (data: FormFields, methods: UseFormReturn<FormFields>) => {
    if (authUser?.id) {
      await updateDetails({
        id: authUser.id,
        firstname: data.forename,
        lastname: data.surname,
        email: data.email,
      })
        .unwrap()
        .then((response) => {
          dispatch(setAuth(response))
          props.onClose()
          successToast('Details have been updated')
        })
        .catch((error) => {
          if (error?.status === 422) return
          errorToast('Unable to update your details, please try again later.')
          methods.reset()
        })
    }
  }

  return (
    <Form<FormFields, typeof formSchema>
      onSubmit={onSubmit}
      className="gap-y-6 min-h-[370px]"
      validationSchema={formSchema}
      queryError={error}
      defaultValues={{
        forename: authUser?.firstname,
        surname: authUser?.lastname,
        email: authUser?.email,
      }}
    >
      {({ formState: { errors, isDirty } }) => (
        <>
          <div className="flex items-center gap-10">
            <div className="space-y-[2px]">
              <p className="font-semibold text-sm text-gray-50">Organisation</p>
              <p className="font-semibold text-base text-gray-80">{organisation?.name}</p>
            </div>

            <div className="space-y-[2px]">
              <p className="font-semibold text-sm text-gray-50">Joined</p>
              <p className="font-semibold text-base text-gray-80">
                <FormatDateTime value={authUser?.verifiedAt} format={DateTime.DATE_MED} />
              </p>
            </div>
          </div>

          <div className="flex gap-x-6">
            <FormControl>
              <FormLabel htmlFor="forename">Forename</FormLabel>
              <FormInput
                name="forename"
                placeHolder="Enter Forename"
                error={!!errors?.forename?.message}
              />
              {errors?.forename?.message && (
                <FormErrorMessage>{errors.forename?.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="surname">Surname</FormLabel>
              <FormInput
                name="surname"
                placeHolder="Enter Surname"
                error={!!errors?.surname?.message}
              />
              {errors?.surname?.message && (
                <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
              )}
            </FormControl>
          </div>

          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput name="email" placeHolder="Enter email" error={!!errors?.email?.message} />
            {errors?.email?.message && <FormErrorMessage>{errors.email?.message}</FormErrorMessage>}
          </FormControl>

          <ModalFooter className="mt-[70px]">
            <span></span>
            <Button
              size="xs"
              className="max-w-[160px]"
              type="submit"
              loading={isLoading}
              disabled={!isDirty}
              block
            >
              Save
            </Button>
          </ModalFooter>
        </>
      )}
    </Form>
  )
}
