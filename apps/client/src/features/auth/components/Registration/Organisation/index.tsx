import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  Form,
  FormControl,
  FormCurrencyInput,
  FormInput,
  FormSelect,
  FormTimeInput,
  HorizontalDivider,
  FormDebouncedInput,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormLabel } from '@/components/Forms/Label'
import { RegistrationSteps } from '../../../types'
import { WeekDaysSelect } from '@/components/WeekDays'
import { WeekDay } from '@/enums/WeekDay'
import { SelectOption } from '@/components/Forms/Select/option'
import { useMemo } from 'react'
import currencies from '@/assets/currency/currency.json'
import { z } from 'zod'
import { DateTime } from 'luxon'
import { useVerifyOrganisationMutation } from '../../../api'
import { CurrencyCode } from '@/types/CurrencyCode'
import { useDispatch, useSelector } from 'react-redux'
import { setOrganisation } from '@/stores/slices/registration'
import { useLazyCheckSubdomainQuery } from '@/features/subdomain'
import { RootState } from '@/stores/store'
import { isEqual } from 'lodash'
import hourlyRateSchema from '@/helpers/validation/hourly_rate'

const OrganisationSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    subdomain: z
      .string()
      .trim()
      .min(1, { message: 'Subdomain is required' })
      .regex(/^[a-z-]+$/, { message: 'Subdomains can only contain lowercase letters and hyphens' }),
    workDays: z.array(z.string()).nonempty({ message: 'At least 1 work day required' }),
    openingTime: z.string().trim().min(1, { message: 'Opening time is required' }),
    closingTime: z.string().trim().min(1, { message: 'Closing time is required' }),
    currency: z.object({
      value: z.string(),
      children: z.string(),
    }),
    hourlyRate: hourlyRateSchema,
  })
  .superRefine((val, ctx) => {
    const openingTime = DateTime.fromFormat(val.openingTime, 'HH:mm')
    const closingTime = DateTime.fromFormat(val.closingTime, 'HH:mm')

    if (openingTime > closingTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Opening time cannot be after the closing time',
        path: ['openingTime'],
      })
    }

    if (closingTime <= openingTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Closing time cannot be before or equal to the opening time',
        path: ['closingTime'],
      })
    }
  })

type FormFields = {
  name: string
  subdomain: string
  workDays: WeekDay[]
  openingTime: string
  closingTime: string
  currency: {
    value: CurrencyCode
    children: string
  }
  hourlyRate: string
}

type OrganisationsViewProps = {
  onBack: (prevStep: RegistrationSteps) => void
  onSuccess: (nextStep: RegistrationSteps) => void
}

export const OrganisationsView = ({ onBack, onSuccess }: OrganisationsViewProps): JSX.Element => {
  const dispatch = useDispatch()

  const organisation = useSelector((state: RootState) => state.registration.organisation)

  const [verifyOrganisation, { isLoading: isVerifying }] = useVerifyOrganisationMutation()

  const [checkSubdomainTrigger, { data: checkSubdomainResult }] = useLazyCheckSubdomainQuery()

  const handleSubmit = async (data: FormFields) => {
    dispatch(setOrganisation(data))
    await verifyOrganisation({
      name: data.name,
      subdomain: data.subdomain,
      opening_time: data.openingTime,
      closing_time: data.closingTime,
      currency: data.currency.value,
      work_days: data.workDays,
      hourly_rate: parseFloat(data.hourlyRate),
    })
      .unwrap()
      .then(() => onSuccess('team'))
      .catch()
  }

  const handleFormChange = (data: FormFields) => {
    if (!isEqual(organisation, data)) {
      dispatch(setOrganisation(data))
    }
  }

  const currencyOptions = useMemo(() => {
    return Object.keys(currencies).map((currency) => ({
      id: currency,
      value: currency,
      display: currencies[currency as keyof typeof currencies],
    }))
  }, [])

  return (
    <Form<FormFields, typeof OrganisationSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      validationSchema={OrganisationSchema}
      defaultValues={{
        name: organisation?.name ?? '',
        subdomain: organisation?.subdomain ?? '',
        workDays: organisation?.workDays ?? [],
        openingTime: organisation?.openingTime ?? '',
        closingTime: organisation?.closingTime ?? '',
        currency: {
          value: organisation?.currency?.value ?? '',
          children: organisation?.currency?.children ?? '',
        },
        hourlyRate: organisation?.hourlyRate ?? '',
      }}
    >
      {({ control, setValue, watch, trigger, formState: { errors } }) => (
        <>
          <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20">
            <div className="space-y-2 pb-6">
              <h1 className="font-semibold text-3xl text-gray-100">Create organisation</h1>
              <p className="text-base text-gray-80">
                Let&apos;s setup your organisation. It&apos;ll be home to everything your team does
                with Arkora
              </p>
            </div>

            <HorizontalDivider />

            {/* Organisation Details */}
            <Descriptor>
              <DescriptorInsights
                title="Organisation Details"
                description="Determine the name that your team will visit"
                className="max-w-md md:max-w-[325px]"
              />
              <DescriptorContent className="max-w-[405px]">
                <div className="flex justify-between gap-3">
                  <FormControl>
                    <FormLabel htmlFor="name" size="sm">
                      Name
                    </FormLabel>

                    <FormInput
                      name="name"
                      placeHolder="Enter name"
                      size="sm"
                      error={!!errors.name}
                    />
                    {errors.name?.message && (
                      <FormErrorMessage size="sm">{errors.name?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="subdomain" size="sm">
                      Subdomain
                    </FormLabel>
                    <FormDebouncedInput
                      name="subdomain"
                      placeHolder="Enter subdomain"
                      size="sm"
                      error={
                        !!errors.subdomain ||
                        (checkSubdomainResult?.exists !== undefined
                          ? checkSubdomainResult?.exists
                          : false)
                      }
                      value={watch('subdomain')}
                      onChange={async (value) => {
                        setValue('subdomain', value)
                        if (value) {
                          /* 
                            We need to manually trigger onChange as the component
                            overrides the register method onChange function and
                            react-hook-form is unable to track it properly.
                          */
                          await trigger('subdomain')
                          checkSubdomainTrigger({ subdomain: value })
                        }
                      }}
                    />
                    {(errors.subdomain?.message ||
                      (checkSubdomainResult?.exists !== undefined
                        ? checkSubdomainResult?.exists
                        : false)) && (
                      <FormErrorMessage size="sm">
                        {errors.subdomain?.message ?? 'Subdomain already taken'}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </DescriptorContent>
            </Descriptor>

            <HorizontalDivider />

            {/* Operating Hours */}
            <Descriptor>
              <DescriptorInsights
                title="Operating Hours"
                description="Specify your organisations working days and
                hours. This lets Arkora know when to send
                notifications, stop timers and more"
                className="max-w-md md:max-w-[325px]"
              />
              <DescriptorContent className="max-w-[405px]">
                <FormControl>
                  <FormLabel htmlFor="workDays" size="sm">
                    Work Days
                  </FormLabel>
                  <WeekDaysSelect name="workDays" control={control} />
                  {errors.workDays?.message && (
                    <FormErrorMessage size="sm">{errors.workDays?.message}</FormErrorMessage>
                  )}
                </FormControl>
                <div className="flex justify-between gap-3">
                  <FormControl>
                    <FormLabel htmlFor="openingTime" size="sm">
                      Opening Time
                    </FormLabel>
                    <FormTimeInput name="openingTime" size="sm" error={!!errors.openingTime} />
                    {errors.openingTime?.message && (
                      <FormErrorMessage size="sm">{errors.openingTime?.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="closngTime" size="sm">
                      Closing Time
                    </FormLabel>
                    <FormTimeInput name="closingTime" size="sm" error={!!errors.closingTime} />
                    {errors.closingTime?.message && (
                      <FormErrorMessage size="sm">{errors.closingTime?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </DescriptorContent>
            </Descriptor>

            <HorizontalDivider />

            {/* Rates and Cost */}
            <Descriptor>
              <DescriptorInsights
                title="Rates and Cost"
                description="Project budgets can be billable on an hourly
                rate, you can even set fixed cost on any
                budget instead"
                className="max-w-md md:max-w-[325px]"
              />
              <DescriptorContent className="max-w-[405px]">
                <div className="flex justify-between gap-3">
                  <FormControl className="flex-grow">
                    <FormLabel htmlFor="currency" size="sm">
                      Currency
                    </FormLabel>
                    <FormSelect name="currency" control={control} placeHolder="Select currency">
                      {currencyOptions?.map((option) => (
                        <SelectOption key={option.id} value={option.value} id={option.id}>
                          {option?.display}
                        </SelectOption>
                      ))}
                    </FormSelect>
                    {errors.currency?.message && (
                      <FormErrorMessage size="sm">{errors.currency?.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl className="max-w-[130px] w-full">
                    <FormLabel htmlFor="hourlyRate" size="sm">
                      Hourly Rate
                    </FormLabel>
                    <FormCurrencyInput
                      size="sm"
                      suffix="£"
                      name="hourlyRate"
                      error={!!errors?.hourlyRate?.message}
                    />
                    {errors.hourlyRate?.message && (
                      <FormErrorMessage size="sm">{errors.hourlyRate?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </DescriptorContent>
            </Descriptor>
          </div>

          <div className="flex justify-between mt-12">
            <button
              type="button"
              className="outline-none text-purple-90 font-semibold text-base hover:text-purple-70"
              onClick={() => onBack('details')}
            >
              Previous Step
            </button>
            <Button size="sm" className="max-w-[220px] w-full" type="submit" loading={isVerifying}>
              Next step
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}
