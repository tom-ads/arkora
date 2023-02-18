import { z } from 'zod'
import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  Form,
  FormControl,
  FormInput,
  FormLabel,
  FormPasswordInput,
  HorizontalDivider,
  PasswordStrength,
  ReadOnly,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useVerifyInvitationMutation } from '../../api'
import { useDispatch } from 'react-redux'
import { setAuth } from '@/stores/slices/auth'
import { setOrganisation } from '@/stores/slices/organisation'
import { useToast } from '@/hooks/useToast'
import { UseFormReturn } from 'react-hook-form'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const InvitationFormSchema = z
  .object({
    firstname: z
      .string()
      .min(1, { message: 'Firstname is required' })
      .regex(/^([^0-9]+)$/, { message: 'Firstname cannot contain numbers' }),
    lastname: z
      .string()
      .min(1, { message: 'Lastname is required' })
      .regex(/^([^0-9]+)$/, { message: ' Lastname cannot contain numbers' }),
    password: z.string().min(1, { message: 'Password is required' }),
    passwordConfirmation: z.string().min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

type InvitationFormFields = {
  firstname: string
  lastname: string
  password: string
  passwordConfirmation: string
}

export const InvitationPage = (): JSX.Element => {
  useDocumentTitle('Join Organisation')

  const dispatch = useDispatch()

  const { errorToast } = useToast()

  const [searchParams] = useSearchParams()

  const [verifyInvitation, { isLoading }] = useVerifyInvitationMutation()

  const invitationParams = useMemo(() => {
    return {
      email: searchParams.get('email'),
      token: searchParams.get('token'),
    }
  }, [searchParams])

  const onSubmit = async (
    data: InvitationFormFields,
    methods: UseFormReturn<InvitationFormFields>,
  ) => {
    // TODO: validate email, if invalid show error from below...
    if (!invitationParams?.email || !invitationParams?.token) {
      errorToast('Invitation is invalid. Please contact your administrator')
      return
    }

    await verifyInvitation({
      firstname: data.firstname,
      lastname: data.lastname,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
      token: invitationParams.token,
      email: invitationParams.email,
    })
      .unwrap()
      .then((response) => {
        dispatch(setAuth(response.user))
        dispatch(setOrganisation(response.organisation))
      })
      .catch((error) => {
        methods.reset()
        errorToast(
          error?.data?.message ??
            'Unable to verify, please try again later or contact your administrator',
        )
      })
  }

  return (
    <div className="my-8">
      <Form<InvitationFormFields, typeof InvitationFormSchema>
        className="gap-0"
        onSubmit={onSubmit}
        validationSchema={InvitationFormSchema}
        defaultValues={{
          firstname: undefined,
          lastname: undefined,
          password: undefined,
          passwordConfirmation: undefined,
        }}
      >
        {({ watch, formState: { errors } }) => (
          <>
            <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20">
              <div className="space-y-2 pb-6">
                <h1 className="font-semibold text-3xl text-gray-100">Join Organisation</h1>
                <p className="text-base text-gray-80">
                  We need to collect some details before you can join your organisation{' '}
                </p>
              </div>

              <HorizontalDivider />

              {/* Your Details */}
              <Descriptor>
                <DescriptorInsights
                  title="Your Details"
                  description="Basic details about you that are displayed across
                your account and to other team members."
                />
                <DescriptorContent className="max-w-[402px]">
                  <div className="flex justify-between gap-3">
                    <FormControl>
                      <FormLabel htmlFor="firstname" size="sm">
                        Firstname
                      </FormLabel>
                      <FormInput
                        name="firstname"
                        placeHolder="Enter firstname"
                        size="sm"
                        error={!!errors.firstname}
                      />
                      {errors.firstname?.message && (
                        <FormErrorMessage size="sm">{errors.firstname?.message}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel htmlFor="lastname" size="sm">
                        Lastname
                      </FormLabel>
                      <FormInput
                        name="lastname"
                        placeHolder="Enter lastname"
                        size="sm"
                        error={!!errors.lastname}
                      />
                      {errors.lastname?.message && (
                        <FormErrorMessage size="sm">{errors.lastname?.message}</FormErrorMessage>
                      )}
                    </FormControl>
                  </div>

                  <FormControl>
                    <FormLabel htmlFor="email" size="sm">
                      Email
                    </FormLabel>
                    <ReadOnly value={invitationParams.email} />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="password" size="sm">
                      Password
                    </FormLabel>
                    <FormPasswordInput
                      name="password"
                      placeHolder="Enter password"
                      error={!!errors?.password}
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
                </DescriptorContent>
              </Descriptor>
            </div>

            <div className="flex justify-end mt-12">
              <Button size="sm" className="max-w-[200px] w-full" type="submit" loading={isLoading}>
                Join Organisation
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}
