import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  Form,
  FormInput,
  FormErrorMessage,
} from '@/components'
import { FormControl } from '@/components/Forms/Control'
import { FormLabel } from '@/components/Forms/Label'
import { FormPasswordInput } from '@/components/Forms/PasswordInput'
import { PasswordStrength } from '@/components/Indicators/PasswordStrength'
import { useVerifyDetailsMutation } from '../../../api'
import { setDetails, setStep } from '@/stores/slices/registration'
import { useDispatch, useSelector } from 'react-redux'
import * as z from 'zod'
import { RootState } from '@/stores/store'
import { validatePassword } from '@/helpers/validation/fields'
import validationIssuer from '@/helpers/validation/issuer'
import { useToast } from '@/hooks/useToast'

const DetailsFormSchema = z
  .object({
    firstname: z
      .string()
      .min(1, { message: 'Firstname is required' })
      .regex(/^([^0-9]+)$/, { message: 'Firstname cannot contain numbers' }),
    lastname: z
      .string()
      .min(1, { message: 'Lastname is required' })
      .regex(/^([^0-9]+)$/, { message: 'Lastname cannot contain numbers' }),
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
  .superRefine((fields, ctx) => {
    const passwordValidation = validatePassword(fields.password)
    validationIssuer('password', passwordValidation, ctx)
  })

type FormFields = {
  firstname: string
  lastname: string
  email: string
  password: string
  passwordConfirmation: string
}

export const DetailsView = (): JSX.Element => {
  const dispatch = useDispatch()

  const { errorToast } = useToast()

  const details = useSelector((state: RootState) => state.registration.details)

  const [verifyDetails, { isLoading: isVerifying }] = useVerifyDetailsMutation()

  const handleSubmit = async (data: FormFields) => {
    dispatch(setDetails(data))
    await verifyDetails({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
    })
      .unwrap()
      .then(() => dispatch(setStep({ step: 'organisation' })))
      .catch((err) => {
        if (err.status === 422) return
        errorToast(
          'We failed to verify your organisations details, please try again or contact us.',
        )
      })
  }

  return (
    <Form<FormFields, typeof DetailsFormSchema>
      className="gap-0"
      onSubmit={handleSubmit}
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
          {/* Your Details */}
          <Descriptor>
            <DescriptorInsights
              title="Your Details"
              description="Basic details for managing your account"
            />
            <DescriptorContent className="max-w-[402px]">
              <div className="flex justify-between gap-3">
                <FormControl>
                  <FormLabel htmlFor="firstname" size="sm">
                    Forename
                  </FormLabel>
                  <FormInput
                    name="firstname"
                    placeHolder="Enter forename"
                    size="sm"
                    error={!!errors.firstname}
                  />
                  {!!errors.firstname?.message && (
                    <FormErrorMessage size="sm">{errors.firstname?.message}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="lastname" size="sm">
                    Surname
                  </FormLabel>
                  <FormInput
                    name="lastname"
                    placeHolder="Enter surname"
                    size="sm"
                    error={!!errors.lastname}
                  />
                  {!!errors.lastname?.message && (
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
                {!!errors.email?.message && (
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
                {!!errors.passwordConfirmation?.message && (
                  <FormErrorMessage>{errors.passwordConfirmation?.message}</FormErrorMessage>
                )}
              </FormControl>
            </DescriptorContent>
          </Descriptor>

          <div className="flex justify-end mt-12">
            <Button size="sm" className="max-w-[220px] w-full" type="submit" loading={isVerifying}>
              Next step
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}
