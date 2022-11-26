import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  Form,
  FormInput,
  Divider,
} from '@/components'
import { FormControl } from '@/components/Forms/Control'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormLabel } from '@/components/Forms/Label'
import { PasswordInput } from '@/components/Forms/PasswordInput'
import { PasswordStrength } from '@/components/Indicators/PasswordStrength'
import { useVerifyDetailsMutation } from '../../../api'
import { setDetails } from '@/stores/slices/registration'
import { useDispatch, useSelector } from 'react-redux'
import * as z from 'zod'
import { RegistrationSteps } from '../../../types'
import { RootState } from '@/stores/store'
import { isEqual } from 'lodash'

const DetailsFormSchema = z
  .object({
    firstname: z
      .string()
      .min(1, { message: 'Firstname is required' })
      .regex(/^([^0-9]+)$/, { message: 'Firstname cannot contain numbers' }),
    lastname: z
      .string()
      .min(1, { message: 'Lastname is required' })
      .regex(/^([^0-9]+)$/, { message: ' Lastname cannot contain numbers' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    passwordConfirmation: z.string().min(1, { message: 'Password confirmation is required' }),
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

  const details = useSelector((state: RootState) => state.registration.details)

  const [verifyDetails, { isLoading: isVerifying }] = useVerifyDetailsMutation()

  const handleSubmit = async (data: FormFields) => {
    dispatch(setDetails(data))
    await verifyDetails({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
    }).then(() => onSuccess('organisation'))
  }

  const handleFormChange = (data: FormFields) => {
    if (!isEqual(details, data)) {
      dispatch(setDetails(data))
    }
  }

  return (
    <Form<FormFields, typeof DetailsFormSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      validationSchema={DetailsFormSchema}
      defaultValues={{
        firstname: details?.firstname ?? '',
        lastname: details?.lastname ?? '',
        email: details.email ?? '',
        password: details.password ?? '',
        passwordConfirmation: '',
      }}
    >
      {({ watch, formState: { errors } }) => (
        <>
          <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20">
            <div className="space-y-2 pb-6">
              <h1 className="font-semibold text-3xl text-gray-100">Your details</h1>
              <p className="text-base text-gray-80">
                Let&apos;s get started! We need to collect some details to setup your account
              </p>
            </div>

            <Divider />

            {/* Profile Image */}
            <Descriptor>
              <DescriptorInsights
                title="Profile Image"
                description="Displayed on your profile for others to see"
              />
              <DescriptorContent className="flex justify-between gap-3 max-w-[402px]">
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
                  <FormInput
                    name="email"
                    placeHolder="Enter email address"
                    size="sm"
                    error={!!errors.email}
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
                  />
                  <PasswordStrength password={watch('password')} isError={!!errors?.password} />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="passwordConfirmation" size="sm">
                    Confirm Password
                  </FormLabel>
                  <PasswordInput
                    name="passwordConfirmation"
                    placeHolder="Enter confirmation"
                    size="sm"
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
            <Button
              size="sm"
              className="max-w-[220px] w-full"
              type="submit"
              isLoading={isVerifying}
            >
              Next step
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}
