import {
  ArkoraLogo,
  FormControl,
  FormInput,
  FormLabel,
  Form,
  PasswordInput,
  Button,
  InlineLink,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { z } from 'zod'

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type FormFields = {
  email: string
  password: string
}

export const LoginPage = (): JSX.Element => {
  useDocumentTitle('Login')

  const organisation = useSelector((state: RootState) => state.organisation)

  const handleSubmit = (data: FormFields) => {
    console.log(data)
  }

  return (
    <div className="flex flex-col justify-center pt-40">
      <div>
        <div className="flex items-center flex-wrap gap-4 pb-6">
          <ArkoraLogo className="w-24 h-24 flex-shrink-0" />
          <div className="flex flex-col justify-start">
            <h2 className="text-gray-100 text-xl">Welcome to</h2>
            <h1 className="font-medium text-3xl text-purple-90">{organisation.name ?? 'Arkora'}</h1>
          </div>
        </div>

        <div className="w-full mb-9">
          <p className="text-gray-60 align-baseline">Please enter your credentials</p>
        </div>

        <Form<FormFields, typeof LoginFormSchema>
          mode="onSubmit"
          className="gap-4"
          onSubmit={handleSubmit}
          validationSchema={LoginFormSchema}
          defaultValues={{ email: '', password: '' }}
        >
          {({ formState: { errors } }) => (
            <>
              <FormControl>
                <FormLabel htmlFor="email" size="sm">
                  Email
                </FormLabel>
                <FormInput
                  name="email"
                  placeHolder="Enter email address"
                  size="sm"
                  error={!!errors.email}
                  className="h-11 text-[15px]"
                />
                {errors.email?.message && (
                  <FormErrorMessage size="sm">{errors.email?.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password" size="sm">
                  Password
                </FormLabel>
                <PasswordInput
                  name="password"
                  placeHolder="Enter password"
                  size="sm"
                  error={!!errors?.password}
                  className="h-11 text-[15px]"
                />
                {errors.password?.message && (
                  <FormErrorMessage size="sm">{errors.password?.message}</FormErrorMessage>
                )}
              </FormControl>

              <InlineLink className="font-semibold text-sm" to="/forgot-password">
                Forgot Password?
              </InlineLink>

              <Button type="submit" size="sm" className="mt-8">
                Login
              </Button>
            </>
          )}
        </Form>
      </div>

      <div className="text-center py-10 w-full mt-auto">
        <h2 className="text-gray-100 font-medium">Need to register?</h2>
        <p className="text-gray-80">Please ask your organisation administrator to invite you</p>
      </div>
    </div>
  )
}
