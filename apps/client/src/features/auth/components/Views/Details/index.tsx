import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  Form,
  FormInput,
} from '@/components'
import Divider from '@/components/Divider'
import { FormControl } from '@/components/Forms/Control'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormLabel } from '@/components/Forms/Label'
import { PasswordInput } from '@/components/Forms/PasswordInput'
import { PasswordStrength } from '@/components/Indicators/PasswordStrength'
import { useVerifyDetailsMutation } from '../../../api'
import { setDetails } from '@/stores/slices/registration'
import { useDispatch } from 'react-redux'
import * as z from 'zod'
import { useEffect } from 'react'
import { RegistrationSteps } from '../../../types'

const DetailsFormSchema = z
  .object({
    firstname: z.string().min(1, { message: 'Firstname is required' }),
    lastname: z.string().min(1, { message: 'Lastname is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    passwordConfirmation: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

type FormFields = {
  firstname: string
  lastname: string
  email: string
  password: string
  passwordConfirmation: string
}

type DetailsViewProps = {
  onSuccess: (nextStep: RegistrationSteps) => void
}

export const DetailsView = ({ onSuccess }: DetailsViewProps): JSX.Element => {
  const dispatch = useDispatch()

  const [verifyDetails, { isSuccess: didVerifyDetails }] = useVerifyDetailsMutation()

  const handleSubmit = (data: FormFields) => {
    dispatch(setDetails(data))
    verifyDetails({
      ...data,
      password_confirmation: data.passwordConfirmation,
    })
  }

  useEffect(() => {
    if (didVerifyDetails) {
      onSuccess('organisation')
    }
  }, [didVerifyDetails])

  return (
    <Form<FormFields, typeof DetailsFormSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      validationSchema={DetailsFormSchema}
      defaultValues={{
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      }}
    >
      {({ register, watch, formState: { errors } }) => (
        <>
          <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20">
            <div className="space-y-2 pb-6">
              <h1 className="font-semibold text-[32px] text-gray-100">Your details</h1>
              <p className="text-base text-gray-80">
                Lets get started! We need to collect some details to setup your account
              </p>
            </div>

            <Divider />

            {/* Profile Image */}
            <Descriptor>
              <DescriptorInsights
                title="Profile Image"
                description="Displayed on your profile for others to see"
              />
              <DescriptorContent className="flex justify-between gap-3 max-w-[402px] w-full">
                <div></div>
              </DescriptorContent>
            </Descriptor>

            <Divider />

            {/* Your Details */}
            <Descriptor>
              <DescriptorInsights
                title="Your Details"
                description="Basic details about you that are displayed across
                    your account and to other team members."
              />
              <DescriptorContent className="space-y-4 max-w-[402px] w-full">
                <div className="flex justify-between gap-3">
                  <FormControl>
                    <FormLabel htmlFor="firstname" size="sm">
                      Firstname
                    </FormLabel>
                    <FormInput
                      id="firstname"
                      placeHolder="Enter firstname"
                      size="sm"
                      error={!!errors.firstname}
                      register={register('firstname')}
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
                      id="lastname"
                      placeHolder="Enter lastname"
                      size="sm"
                      error={!!errors.lastname}
                      register={register('lastname')}
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
                  <FormInput
                    id="email"
                    placeHolder="Enter email address"
                    size="sm"
                    error={!!errors.email}
                    register={register('email')}
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
                    id="password"
                    placeHolder="Enter password"
                    size="sm"
                    error={!!errors?.password}
                    register={register('password')}
                  />
                  <PasswordStrength password={watch('password')} isError={!!errors?.password} />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="passwordConfirmation" size="sm">
                    Confirm Password
                  </FormLabel>
                  <PasswordInput
                    id="passwordConfirmation"
                    placeHolder="Enter password"
                    size="sm"
                    error={!!errors.passwordConfirmation?.message}
                    register={register('passwordConfirmation')}
                  />
                  {errors.passwordConfirmation?.message && (
                    <FormErrorMessage>{errors.passwordConfirmation?.message}</FormErrorMessage>
                  )}
                </FormControl>
              </DescriptorContent>
            </Descriptor>
          </div>

          <div className="flex justify-end mt-12">
            <Button size="sm" className="max-w-[220px] w-full" type="submit">
              Next step
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}
