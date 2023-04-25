import {
  FormControl,
  FormInput,
  FormLabel,
  HorizontalDivider,
  Form,
  Button,
  FormErrorMessage,
} from '@/components'
import { useToast } from '@/hooks/useToast'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { useForgotPasswordMutation } from '../../api'

type ForgotPasswordFormFields = {
  email: string
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email address' }),
})

export const ForgotPasswordPage = (): JSX.Element => {
  const [resetPassword, { isLoading }] = useForgotPasswordMutation()

  const { successToast, errorToast } = useToast()

  const handleSubmit = async (
    data: ForgotPasswordFormFields,
    methods: UseFormReturn<ForgotPasswordFormFields>,
  ) => {
    await resetPassword(data.email)
      .unwrap()
      .then(() => successToast('Reset link has been sent'))
      .catch(() =>
        errorToast(
          'Unable to send reset link, please try again later or contact your administrator',
        ),
      )

    methods.resetField('email')
  }

  return (
    <div className="my-8">
      <div className="bg-white rounded py-9 px-8 mt-10 shadow-sm shadow-gray-20 max-w-2xl mx-auto">
        <div className="pb-4">
          <h1 className="font-semibold text-3xl text-gray-100">Forgot Password</h1>
          <p className="text-base text-gray-80">
            Enter your email address and we will send you a reset password link
          </p>
        </div>

        <HorizontalDivider />

        <Form<ForgotPasswordFormFields, typeof forgotPasswordSchema>
          onSubmit={handleSubmit}
          mode="onSubmit"
          defaultValues={{ email: '' }}
          className="pt-5"
          validationSchema={forgotPasswordSchema}
        >
          {({ formState: { errors } }) => (
            <>
              <FormControl className="mb-14">
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormInput
                  name="email"
                  placeHolder="Enter email"
                  size="sm"
                  error={!!errors.email?.message}
                />
                {errors.email?.message && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>

              <div className="flex justify-end">
                <Button
                  size="xs"
                  type="submit"
                  className="max-w-[200px] w-full"
                  disabled={isLoading}
                >
                  Reset Password
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
