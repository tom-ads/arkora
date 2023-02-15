import {
  FormControl,
  FormCurrencyInput,
  FormDescription,
  FormLabel,
  FormNumberInput,
  FormSelect,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { SelectOption } from '@/components/Forms/Select/option'
import BillableType from '@/enums/BillableType'
import { billableTypeOption } from '../..'

type VariableBudgetSectionProps = {
  watch: any
  control: any
  errors: any
}

export const VariableBudgetSection = ({
  watch,
  errors,
  control,
}: VariableBudgetSectionProps): JSX.Element => {
  return (
    <>
      <FormControl>
        <FormLabel htmlFor="billableType" className="mb-0">
          Estimation
        </FormLabel>
        <FormDescription>
          Determine the estimation method that we use to track budget progression
        </FormDescription>
      </FormControl>

      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <FormControl>
          <FormSelect name="billableType" control={control} placeHolder="Select total" fullWidth>
            {billableTypeOption?.map((option) => (
              <SelectOption key={option.id}>{option?.display}</SelectOption>
            ))}
          </FormSelect>
        </FormControl>

        <FormControl>
          {watch('billableType') === BillableType.TOTAL_COST ? (
            <FormCurrencyInput
              name="budget"
              suffix="£"
              placeHolder="Enter total cost"
              error={!!errors.budget?.message}
            />
          ) : (
            <FormNumberInput
              name="budget"
              placeHolder="Enter total hours"
              error={!!errors?.budget?.message}
              suffix="/hrs"
            />
          )}
          {errors?.budget?.message && <FormErrorMessage>{errors.budget.message}</FormErrorMessage>}
        </FormControl>
      </div>

      <FormControl className="sm:max-w-[287px]">
        <FormLabel htmlFor="hourlyRate" className="mb-0">
          Rate (Hourly)
        </FormLabel>
        <FormDescription>Specify the rate to bill the client per hour</FormDescription>
        <FormCurrencyInput
          name="hourlyRate"
          suffix="£"
          placeHolder="Enter rate"
          error={!!errors.hourlyRate?.message}
        />
        {errors?.hourlyRate?.message && (
          <FormErrorMessage>{errors.hourlyRate.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  )
}
