import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  Form,
  FormControl,
  FormInput,
  FormSelect,
  FormTimeInput,
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
}

const OrganisationDetailsSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  subdomain: z.string().trim().min(1, { message: 'Subdomain is required' }),
  selectedDays: z.enum([
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
    WeekDay.SATURDAY,
    WeekDay.SUNDAY,
  ]),
  openingTime: z.string().trim(),
  closingTime: z.string().trim(),
})

type OrganisationsViewProps = {
  onSuccess: (nextStep: RegistrationSteps) => void
}

export const OrganisationsView = ({ onSuccess }: OrganisationsViewProps): JSX.Element => {
  const handleSubmit = (data: FormFields) => {
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
        name: undefined,
        subdomain: undefined,
        workDays: [],
        openingTime: undefined,
        closingTime: undefined,
        defaultCurrency: {
          value: 'GBP',
          children: 'British Pound Sterling',
        },
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
              />
              <DescriptorContent className="max-w-[400px]">
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
              />
              <DescriptorContent className="min-w-[400px] max-w-[402px]">
                <FormControl>
                  <FormLabel size="sm">Week Days</FormLabel>
                  <WeekDaysSelect name="workDays" control={control} />
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
                  </FormControl>
                  <FormControl>
                    <FormLabel size="sm">Closing Time</FormLabel>
                    <FormTimeInput
                      id="closingTime"
                      size="sm"
                      error={!!errors.closingTime}
                      register={register('closingTime')}
                    />
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
              />
              <DescriptorContent className="max-w-[402px]">
                <FormSelect name="defaultCurrency" control={control} placeHolder="Select currency">
                  {currencyOptions?.map((option) => (
                    <SelectOption key={option.id} value={option.value}>
                      {option?.display}
                    </SelectOption>
                  ))}
                </FormSelect>
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
