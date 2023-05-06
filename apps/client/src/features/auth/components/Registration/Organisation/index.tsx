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
  FormErrorMessage,
  FormLabel,
  FormLabelInfo,
} from '@/components'
import { WeekDaysSelect } from '@/components/WeekDays'
import { SelectOption } from '@/components/Forms/Select/option'
import { useMemo } from 'react'
import currencies from '@/assets/currency/currency.json'
import { z } from 'zod'
import { DateTime } from 'luxon'
import { useVerifyOrganisationMutation } from './../../../api'
import { useDispatch, useSelector } from 'react-redux'
import { setOrganisation, setStep } from '@/stores/slices/registration'
import { useLazyCheckSubdomainQuery } from '@/features/subdomain'
import { RootState } from '@/stores/store'
import hourlyRateSchema from '@/helpers/validation/hourly_rate'
import { OrganisationFormFields } from '@/features/organisation'
import { convertToPennies } from '@/helpers/currency'
import { useToast } from '@/hooks/useToast'
import { convertTimeToMinutes } from '@/helpers/date'

const OrganisationSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    subdomain: z
      .string()
      .trim()
      .min(1, { message: 'Subdomain is required' })
      .regex(/^[a-z-]+$/, { message: 'Subdomains can only contain lowercase letters and hyphens' }),
    businessDays: z.array(z.string()).nonempty({ message: 'At least 1 work day required' }),
    openingTime: z.string().trim().min(1, { message: 'Opening time is required' }),
    closingTime: z.string().trim().min(1, { message: 'Closing time is required' }),
    breakDuration: z.string().trim().min(1, { message: 'Break duration is required' }),
    currency: z.string(),
    defaultRate: hourlyRateSchema,
  })
  .superRefine((fields, ctx) => {
    const openingTime = DateTime.fromFormat(fields.openingTime, 'HH:mm')
    const closingTime = DateTime.fromFormat(fields.closingTime, 'HH:mm')

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

    const workDayDuration = closingTime.diff(openingTime).as('minutes')
    const breakDuration = convertTimeToMinutes(fields.breakDuration ?? 0)

    if (breakDuration >= workDayDuration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Break duration cannot exceed work day duration',
        path: ['breakDuration'],
      })
    }
  })

export const OrganisationsView = (): JSX.Element => {
  const dispatch = useDispatch()

  const organisation = useSelector((state: RootState) => state.registration.organisation)

  const { errorToast } = useToast()

  const [verifyOrganisation, { isLoading: isVerifying }] = useVerifyOrganisationMutation()

  const [checkSubdomainTrigger, { data: checkSubdomainResult }] = useLazyCheckSubdomainQuery()

  const handleSubmit = async (data: OrganisationFormFields) => {
    dispatch(setOrganisation(data))
    await verifyOrganisation({
      ...data,
      breakDuration: convertTimeToMinutes(data.breakDuration),
      defaultRate: convertToPennies(data.defaultRate),
    })
      .unwrap()
      .then(() => dispatch(setStep({ step: 'team' })))
      .catch((err) => {
        if (err.status === 422) return
        errorToast(
          'We failed to verify your organisation details. Please try again or contact our support.',
        )
      })
  }

  const currencyOptions = useMemo(() => {
    return Object.keys(currencies).map((currencyCode) => ({
      id: currencyCode,
      display: currencies[currencyCode as keyof typeof currencies],
    }))
  }, [])

  return (
    <Form<OrganisationFormFields, typeof OrganisationSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      validationSchema={OrganisationSchema}
      defaultValues={{
        name: organisation?.name ?? '',
        subdomain: organisation?.subdomain ?? '',
        businessDays: organisation?.businessDays ?? [],
        openingTime: organisation?.openingTime ?? '',
        closingTime: organisation?.closingTime ?? '',
        currency: organisation?.currency ?? 'GBP',
        defaultRate: (organisation?.defaultRate as number) ?? null,
        breakDuration: organisation?.breakDuration ?? undefined,
      }}
    >
      {({ control, setValue, watch, trigger, formState: { errors } }) => (
        <>
          {/* Organisation Details */}
          <Descriptor>
            <DescriptorInsights
              title="Organisation Details"
              description="Specify the domain that your team will use to access the organisation."
              className="max-w-md md:max-w-[325px]"
            />
            <DescriptorContent className="max-w-[405px]">
              <div className="flex justify-between gap-3">
                <FormControl>
                  <FormLabel htmlFor="name" size="sm">
                    Name
                  </FormLabel>

                  <FormInput name="name" placeHolder="Enter name" size="sm" error={!!errors.name} />
                  {errors.name?.message && (
                    <FormErrorMessage size="sm">{errors.name?.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <FormLabel htmlFor="subdomain" size="sm">
                      Subdomain
                    </FormLabel>
                    <FormLabelInfo width={300}>
                      <span className="text-sm font-medium">
                        The subdomain will be used to access your organisation site with Arkora.
                      </span>
                    </FormLabelInfo>
                  </div>

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
              title="Tracking Requirements"
              description="Working days and hours determine the daily and weekly tracking goals for the team."
              className="max-w-md md:max-w-[325px]"
            />
            <DescriptorContent className="max-w-[405px]">
              <FormControl>
                <FormLabel htmlFor="businessDays" size="sm">
                  Work Days
                </FormLabel>
                <WeekDaysSelect name="businessDays" control={control} />
                {errors.businessDays?.message && (
                  <FormErrorMessage size="sm">{errors.businessDays?.message}</FormErrorMessage>
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

                <FormControl>
                  <FormLabel htmlFor="breakDuration" size="sm">
                    Break Duration
                  </FormLabel>
                  <FormTimeInput name="breakDuration" size="sm" error={!!errors.breakDuration} />
                  {errors.breakDuration?.message && (
                    <FormErrorMessage size="sm">{errors.breakDuration?.message}</FormErrorMessage>
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
              description="Specify how you want costs to be displayed and the default rate for budgets."
              className="max-w-md md:max-w-[325px]"
            />
            <DescriptorContent className="max-w-[405px]">
              <div className="space-y-6">
                <FormControl className="flex-grow">
                  <FormLabel htmlFor="currency" size="sm">
                    Currency
                  </FormLabel>
                  <FormSelect name="currency" control={control} placeHolder="Select currency">
                    {currencyOptions?.map((option) => (
                      <SelectOption key={option.id} id={option.id}>
                        {option?.display}
                      </SelectOption>
                    ))}
                  </FormSelect>
                  {errors.currency?.message && (
                    <FormErrorMessage size="sm">{errors.currency?.message}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="defaultRate" size="sm">
                    Default Rate (Hourly)
                  </FormLabel>
                  <FormCurrencyInput
                    size="sm"
                    currency={watch('currency')}
                    name="defaultRate"
                    placeHolder="Enter rate"
                    error={!!errors?.defaultRate?.message}
                  />
                  {errors.defaultRate?.message && (
                    <FormErrorMessage size="sm">{errors.defaultRate?.message}</FormErrorMessage>
                  )}
                </FormControl>
              </div>
            </DescriptorContent>
          </Descriptor>

          <div className="flex justify-between mt-12">
            <button
              type="button"
              className="outline-none text-purple-90 font-semibold text-base hover:text-purple-70"
              onClick={() => dispatch(setStep({ step: 'details' }))}
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
