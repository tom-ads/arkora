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
  InlineLink,
} from '@/components'
import Divider from '@/components/Divider'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormLabel } from '@/components/Forms/Label'
import { RegistrationSteps } from '../../../types'
import { WeekDaysSelect } from '@/components/WeekDays'
import { WeekDay } from '@/enums/WeekDay'
import { z } from 'zod'
import { SelectOption } from '@/components/Forms/Select/option'
import { useMemo } from 'react'
import currencies from '@/assets/currency/currency.json'
import { DateTime } from 'luxon'

type FormFields = {
  name: string
  subdomain: string
  workDays: WeekDay[]
  openingTime: string
  closingTime: string
  defaultCurrency: {
    value: string
    children: string
  }
  defaultHourlyRate: string
}

const OrganisationDetailsSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    subdomain: z.string().trim().min(1, { message: 'Subdomain is required' }),
    workDays: z.array(z.string()).nonempty({ message: 'At least 1 work day required' }),
    openingTime: z.string().trim().min(1, { message: 'Opening time is required' }),
    closingTime: z.string().trim().min(1, { message: 'Closing time is required' }),
    defaultHourlyRate: z.string().superRefine((val, ctx) => {
      const hourlyRate = parseInt(val, 10)

      const issues = [
        { test: isNaN(hourlyRate), errorMessage: 'Valid rate required' },
        { test: hourlyRate <= 0, errorMessage: 'Must be greater than 0' },
        { test: hourlyRate > 20000, errorMessage: 'Cannot exceed 20,000' },
      ]

      if (Object.values(issues).some((i) => i.test)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: Object.values(issues).find((p) => p.test)?.errorMessage,
        })
      }
    }),
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

type OrganisationsViewProps = {
  onBack: (prevStep: RegistrationSteps) => void
  onSuccess: (nextStep: RegistrationSteps) => void
}

export const OrganisationsView = ({ onBack, onSuccess }: OrganisationsViewProps): JSX.Element => {
  const handleSubmit = (data: FormFields) => {
    console.log(data)
    console.log()
  }

  const currencyOptions = useMemo(() => {
    return Object.keys(currencies).map((currency) => ({
      id: currency,
      value: currency,
      display: currencies[currency as keyof typeof currencies],
    }))
  }, [])

  return (
    <Form<FormFields, typeof OrganisationDetailsSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      validationSchema={OrganisationDetailsSchema}
      defaultValues={{
        name: '',
        subdomain: '',
        workDays: [],
        openingTime: '',
        closingTime: '',
        defaultCurrency: {
          value: 'GBP',
          children: 'British Pound Sterling',
        },
        defaultHourlyRate: '',
      }}
    >
      {({ register, control, formState: { errors } }) => (
        <>
          <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20">
            <div className="space-y-2 pb-6">
              <h1 className="font-semibold text-[32px] text-gray-100">Create organisation</h1>
              <p className="text-base text-gray-80">
                Let&apos;s setup your organisation. It&apos;ll be home to everything your team does
                with Arkora
              </p>
            </div>

            <Divider />

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
                      id="name"
                      placeHolder="Enter name"
                      size="sm"
                      error={!!errors.name}
                      register={register('name')}
                    />
                    {errors.name?.message && (
                      <FormErrorMessage size="sm">{errors.name?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="subdomain" size="sm">
                      Subdomain
                    </FormLabel>
                    <FormInput
                      id="subdomain"
                      placeHolder="Enter subdomain"
                      size="sm"
                      error={!!errors.subdomain}
                      register={register('subdomain')}
                    />
                    {errors.subdomain?.message && (
                      <FormErrorMessage size="sm">{errors.subdomain?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </DescriptorContent>
            </Descriptor>

            <Divider />

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
                  <FormLabel size="sm">Work Days</FormLabel>
                  <WeekDaysSelect name="workDays" control={control} />
                  {errors.workDays?.message && (
                    <FormErrorMessage size="sm">{errors.workDays?.message}</FormErrorMessage>
                  )}
                </FormControl>
                <div className="flex justify-between gap-3">
                  <FormControl>
                    <FormLabel size="sm">Opening Time</FormLabel>
                    <FormTimeInput
                      id="openingTime"
                      size="sm"
                      error={!!errors.openingTime}
                      register={register('openingTime')}
                    />
                    {errors.openingTime?.message && (
                      <FormErrorMessage size="sm">{errors.openingTime?.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel size="sm">Closing Time</FormLabel>
                    <FormTimeInput
                      id="closingTime"
                      size="sm"
                      error={!!errors.closingTime}
                      register={register('closingTime')}
                    />
                    {errors.closingTime?.message && (
                      <FormErrorMessage size="sm">{errors.closingTime?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </DescriptorContent>
            </Descriptor>

            <Divider />

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
                    <FormLabel size="sm">Currency</FormLabel>
                    <FormSelect
                      name="defaultCurrency"
                      control={control}
                      placeHolder="Select currency"
                    >
                      {currencyOptions?.map((option) => (
                        <SelectOption key={option.id} value={option.value}>
                          {option?.display}
                        </SelectOption>
                      ))}
                    </FormSelect>
                  </FormControl>

                  <FormControl className="max-w-[130px] w-full">
                    <FormLabel size="sm">Hourly Rate</FormLabel>
                    <FormCurrencyInput
                      size="sm"
                      prefix="£"
                      name="defaultHourlyRate"
                      control={control}
                      error={!!errors?.defaultHourlyRate?.message}
                    />
                    {errors.defaultHourlyRate?.message && (
                      <FormErrorMessage size="sm">
                        {errors.defaultHourlyRate?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </div>
              </DescriptorContent>
            </Descriptor>
          </div>

          <div className="flex justify-between mt-12">
            <button
              className="outline-none text-purple-90 font-semibold text-base"
              onClick={() => onBack('details')}
            >
              Previous Step
            </button>
            <Button size="sm" className="max-w-[220px] w-full" type="submit">
              Next step
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}
