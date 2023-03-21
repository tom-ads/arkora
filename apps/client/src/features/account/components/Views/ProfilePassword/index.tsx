import {
  Button,
  Form,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormPasswordInput,
  PasswordStrength,
} from '@/components'
import { ModalFooter } from '@/components/Modal'
import { useChangePasswordMutation } from '@/features/auth'
import { validatePassword } from '@/helpers/validation/fields'
import validationIssuer from '@/helpers/validation/issuer'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

type FormFields = {
  currentPassword: string
  newPassword: string
  passwordConfirmation: string
}

const formSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z.string().min(1, { message: 'New password is required' }),
    passwordConfirmation: z.string().min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })
  .superRefine((fields, ctx) => {
    const currPassValidation = validatePassword(fields.currentPassword)
    const newPassValidation = validatePassword(fields.newPassword)

    validationIssuer('currentPassword', currPassValidation, ctx)
    validationIssuer('newPassword', newPassValidation, ctx)
  })

export const ProfilePasswordView = (props: ModalBaseProps): JSX.Element => {
  const [changePassword, { error, isLoading }] = useChangePasswordMutation()

  const { successToast, errorToast } = useToast()

  const onSubmit = async (data: FormFields, methods: UseFormReturn<FormFields>) => {
    await changePassword({
      current_password: data.currentPassword,
      new_password: data.newPassword,
      password_confirmation: data.passwordConfirmation,
    })
      .unwrap()
      .then(() => {
        successToast('Password has been changed')
        props.onClose()
        methods.reset()
      })
      .catch((error) => {
        if (error?.status === 422) {
          methods.resetField('passwordConfirmation')
          return
        }
        errorToast('Unable to change your password, please try again later')
        methods.reset()
      })
  }

  return (
    <Form<FormFields, typeof formSchema>
      mode="onSubmit"
      onSubmit={onSubmit}
      className="gap-y-6 min-h-[370px]"
      validationSchema={formSchema}
      queryError={error}
      defaultValues={{
        currentPassword: undefined,
        newPassword: undefined,
        passwordConfirmation: undefined,
      }}
    >
      {({ watch, formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
            <FormPasswordInput
              name="currentPassword"
              placeHolder="Enter current password"
              error={!!errors.currentPassword?.message}
            />
            {errors.currentPassword?.message && (
              <FormErrorMessage>{errors.currentPassword?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="currentPassword">New Password</FormLabel>
            <FormPasswordInput
              name="newPassword"
              placeHolder="Enter new password"
              error={!!errors.newPassword?.message}
            />
            <PasswordStrength
              password={watch('newPassword')}
              isError={!!errors?.newPassword}
              hideSuggestions
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="passwordConfirmation" size="sm">
              Confirm Password
            </FormLabel>
            <FormPasswordInput
              name="passwordConfirmation"
              placeHolder="Enter confirmation"
              error={!!errors.passwordConfirmation?.message}
            />
            {errors.passwordConfirmation?.message && (
              <FormErrorMessage>{errors.passwordConfirmation?.message}</FormErrorMessage>
            )}
          </FormControl>

          <ModalFooter className="mt-[31px]">
            <span></span>
            <Button size="xs" className="max-w-[160px]" type="submit" loading={isLoading} block>
              Change
            </Button>
          </ModalFooter>
        </>
      )}
    </Form>
  )
}
