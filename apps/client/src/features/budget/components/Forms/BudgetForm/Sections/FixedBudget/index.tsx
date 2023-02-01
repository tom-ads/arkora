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
import { Transition } from '@headlessui/react'
import { billableTypeOption } from '../..'

type FixedBudgetSectionProps = {
  watch: any
  control: any
  errors: any
  show: boolean
  afterLeave: () => void
}

export const FixedBudgetSection = ({
  show,
  control,
  watch,
  errors,
  afterLeave,
}: FixedBudgetSectionProps): JSX.Element => {
  return (
    <Transition
      show={show}
      enter="transition duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition duration-150 opacity-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={afterLeave}
    >
      <div className="flex gap-4">
        <FormControl className="mb-5">
          <FormLabel htmlFor="fixedPrice" className="mb-0">
            Fixed Price
          </FormLabel>
          <FormDescription>The fixed amount to charge the client</FormDescription>
          <FormCurrencyInput
            name="fixedPrice"
            suffix="£"
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
            suffix="£"
            placeHolder={
              watch('billableType') === BillableType.TOTAL_HOURS ? '- - -' : 'Enter rate'
            }
            error={
              !!errors.hourlyRate?.message && watch('billableType') !== BillableType.TOTAL_HOURS
            }
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

      <div className="flex gap-4">
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
              name="fixedPrice"
              suffix="£"
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
    </Transition>
  )
}
