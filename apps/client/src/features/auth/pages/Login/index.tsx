import {
  ArkoraLogo,
  FormControl,
  FormInput,
  FormPasswordInput,
  FormLabel,
  Form,
  Button,
  InlineLink,
  FormErrorMessage,
} from '@/components'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { setAuth } from '@/stores/slices/auth'
import { setOrganisation } from '@/stores/slices/organisation'
import { startTracking } from '@/stores/slices/timer'
import { RootState } from '@/stores/store'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useLoginMutation } from '../../api'

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

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const organisation = useSelector((state: RootState) => state.organisation)

  const [login, { isError: didLoginError, isLoading: isLoggingIn }] = useLoginMutation()

  const handleSubmit = async (data: FormFields) => {
    await login(data)
      .unwrap()
      .then((response) => {
        dispatch(setAuth(response.user))
        dispatch(setOrganisation(response.organisation))
        if (response.timer) {
          dispatch(startTracking(response.timer))
        }

        navigate('/timer', { replace: true })
      })
      .catch(() => {
        /* */
      })
  }

  if (!organisation?.subdomain) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex flex-col justify-center self-center">
      <div className="flex items-center flex-wrap gap-4 pb-6">
        <ArkoraLogo className="w-24 h-2- flex-shrink-0" />
        <div className="flex flex-col justify-start">
          <h2 className="text-gray-100 text-xl">Welcome to</h2>
          <h1 className="font-medium text-3xl text-purple-90">{organisation.name ?? 'Arkora'}</h1>
        </div>
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
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                name="email"
                placeHolder="Enter email"
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
              <FormPasswordInput
                name="password"
                placeHolder="Enter password"
                size="sm"
                error={!!errors?.password}
                className="h-11"
              />
              {errors.password?.message && (
                <FormErrorMessage size="sm">{errors.password?.message}</FormErrorMessage>
              )}
              {!errors.password?.message && didLoginError && (
                <FormErrorMessage size="sm">
                  Email or password incorrect, please try your details again
                </FormErrorMessage>
              )}
            </FormControl>

            <div className="flex justify-end">
              <InlineLink className="font-semibold text-sm" to="/forgot-password">
                Forgot Password?
              </InlineLink>
            </div>

            <Button type="submit" size="sm" className="mt-8" loading={isLoggingIn}>
              Login
            </Button>
          </>
        )}
      </Form>

      <div className="text-center py-10 w-full mt-auto">
        <h2 className="text-gray-100 font-medium">Need to register?</h2>
        <p className="text-gray-80">Please ask your organisation administrator to invite you</p>
      </div>
    </div>
  )
}
