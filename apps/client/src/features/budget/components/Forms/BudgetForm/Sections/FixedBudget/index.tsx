import {
  FormControl,
  FormCurrencyInput,
  FormDescription,
  FormLabel,
  FormNumberInput,
  FormSelect,
  FormErrorMessage,
} from '@/components'
import { SelectOption } from '@/components/Forms/Select/option'
import BillableType from '@/enums/BillableType'

import { billableTypeOption } from '../..'

type FixedBudgetSectionProps = {
  watch: any
  control: any
  errors: any
}

export const FixedBudgetSection = ({
  control,
  watch,
  errors,
}: FixedBudgetSectionProps): JSX.Element => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:gap-4 mb-4 sm:mb-0">
        <FormControl className="mb-5">
          <FormLabel htmlFor="fixedPrice" className="mb-0">
            Fixed Price
          </FormLabel>
          <FormDescription>The fixed amount to charge the client</FormDescription>
          <FormCurrencyInput
            name="fixedPrice"
            currency="£"
            placeHolder="Enter price"
            error={!!errors.fixedPrice?.message}
          />
          {errors?.fixedPrice?.message && (
            <FormErrorMessage>{errors.fixedPrice.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="hourlyRate" className="mb-0">
            Rate (Hourly)
          </FormLabel>
          <FormDescription>Specify the rate to track progress</FormDescription>
          <FormCurrencyInput
            name="hourlyRate"
            currency="£"
            placeHolder={
              watch('billableType') === BillableType.TOTAL_HOURS ? '- - -' : 'Enter rate'
            }
            error={!!errors.hourlyRate?.message}
            disabled={watch('billableType') === BillableType.TOTAL_HOURS}
          />
          {errors?.hourlyRate?.message && (
            <FormErrorMessage>{errors.hourlyRate.message}</FormErrorMessage>
          )}
        </FormControl>
      </div>

      <FormControl>
        <FormLabel htmlFor="billableType" className="mb-0">
          Tracking
        </FormLabel>
        <FormDescription>Determine the metric used to track budget progression</FormDescription>
      </FormControl>

      <div className="flex flex-col sm:flex-row gap-4">
        <FormControl>
          <FormSelect name="billableType" control={control} placeHolder="Select total" fullWidth>
            {billableTypeOption?.map((option) => (
              <SelectOption key={option.id} id={option.id}>
                {option?.display}
              </SelectOption>
            ))}
          </FormSelect>
        </FormControl>

        <FormControl>
          {watch('billableType') === BillableType.TOTAL_COST ? (
            <FormCurrencyInput
              name="fixedPrice"
              currency="£"
              disabled={watch('billableType') === BillableType.TOTAL_COST}
            />
          ) : (
            <>
              <FormNumberInput
                name="budget"
                placeHolder="Enter total hours"
                error={!!errors?.budget?.message}
                suffix="/hrs"
              />
              {errors?.budget?.message && (
                <FormErrorMessage>{errors.budget.message}</FormErrorMessage>
              )}
            </>
          )}
        </FormControl>
      </div>
    </>
  )
}
