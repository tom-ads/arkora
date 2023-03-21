import {
  FormControl,
  FormLabel,
  HorizontalDivider,
  Form,
  Button,
  FormErrorMessage,
  FormPasswordInput,
  PasswordStrength,
} from '@/components'
import { validatePassword } from '@/helpers/validation/fields'
import validationIssuer from '@/helpers/validation/issuer'
import { useToast } from '@/hooks/useToast'
import { UseFormReturn } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { useResetPasswordMutation } from '../../api'

type ResetPasswordFormFields = {
  password: string
  passwordConfirmation: string
}

const resetPasswordFormFields = z
  .object({
    password: z.string().min(1, { message: 'New password is required' }),
    passwordConfirmation: z.string().min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })
  .superRefine((fields, ctx) => {
    const passwordValidation = validatePassword(fields.password)
    validationIssuer('password', passwordValidation, ctx)
  })

export const ResetPasswordPage = (): JSX.Element => {
  const navigate = useNavigate()

  const { successToast } = useToast()

  const [resetPassword, { error }] = useResetPasswordMutation()

  const [searchParams] = useSearchParams()

  const handleSubmit = async (data: ResetPasswordFormFields) => {
    const userId = searchParams.get('user_id')
    const token = searchParams.get('token')

    if (userId && token) {
      await resetPassword({ userId, token, ...data })
        .unwrap()
        .then(() => {
          navigate('/login')
          successToast('Your password has been reset')
        })
        .catch(() => {
          /* */
        })
    }
  }

  return (
    <div className="my-8">
      <div className="bg-white rounded py-9 px-8 mt-10 shadow-sm shadow-gray-20 max-w-2xl mx-auto">
        <div className="pb-4">
          <h1 className="font-semibold text-3xl text-gray-100">Reset Password</h1>
          <p className="text-base text-gray-80">Enter your new password</p>
        </div>

        <HorizontalDivider />

        <Form<ResetPasswordFormFields, typeof resetPasswordFormFields>
          onSubmit={handleSubmit}
          defaultValues={{}}
          className="pt-5 space-y-6"
          queryError={error}
          validationSchema={resetPasswordFormFields}
        >
          {({ watch, formState: { errors } }) => (
            <>
              <FormControl>
                <FormLabel htmlFor="password">New Password</FormLabel>
                <FormPasswordInput
                  name="password"
                  placeHolder="Enter password"
                  error={!!errors.password?.message}
                />
                <PasswordStrength password={watch('password')} isError={!!errors?.password} />
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

              <div className="flex justify-end mt-20">
                <Button type="submit" size="xs" className="max-w-[200px] w-full">
                  Submit
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
