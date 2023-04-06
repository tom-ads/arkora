import {
  FormControl,
  FormCurrencyInput,
  FormErrorMessage,
  FormLabel,
  FormSelect,
} from '@/components'
import { OrganisationWithTasksFormFields } from '@/features/organisation'
import { ModalBaseProps } from '@/types'
import { useMemo } from 'react'
import currencies from '@/assets/currency/currency.json'
import { UseFormReturn } from 'react-hook-form'
import { SelectOption } from '@/components/Forms/Select/option'

type OrganisationRatesViewProps = ModalBaseProps & UseFormReturn<OrganisationWithTasksFormFields>

export const OrganisationRatesView = ({
  formState,
  control,
  watch,
}: OrganisationRatesViewProps): JSX.Element => {
  const currencyOptions = useMemo(() => {
    return Object.keys(currencies).map((currencyCode) => ({
      id: currencyCode,
      display: currencies[currencyCode as keyof typeof currencies],
    }))
  }, [])

  return (
    <>
      <FormControl className="flex-grow">
        <FormLabel htmlFor="currency" size="sm">
          Currency
        </FormLabel>
        <FormSelect
          name="currency"
          control={control}
          placeHolder="Select currency"
          error={!!formState.errors.currency}
        >
          {currencyOptions?.map((option) => (
            <SelectOption key={option.id} id={option.id}>
              {option?.display}
            </SelectOption>
          ))}
        </FormSelect>
        {formState?.errors?.currency?.message && (
          <FormErrorMessage size="sm">{formState?.errors?.currency?.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="defaultRate" size="sm">
          Default Rate (Hourly)
        </FormLabel>
        <FormCurrencyInput
          size="sm"
          currency={watch('currency')}
          placeHolder="Enter rate"
          name="defaultRate"
          error={!!formState?.errors?.defaultRate?.message}
        />
        {formState?.errors?.defaultRate?.message && (
          <FormErrorMessage size="sm">{formState?.errors?.defaultRate?.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  )
}
