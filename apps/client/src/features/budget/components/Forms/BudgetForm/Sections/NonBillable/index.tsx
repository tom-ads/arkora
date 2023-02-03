import { FormControl, FormDescription, FormLabel, FormNumberInput } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { Transition } from '@headlessui/react'

type NonBillableSectionProps = {
  errors: any
  show: boolean
  afterLeave: () => void
}

export const NonBillableSection = ({
  show,
  errors,
  afterLeave,
}: NonBillableSectionProps): JSX.Element => {
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
      <FormControl className="max-w-[350px]">
        <FormLabel htmlFor="budget" className="mb-0">
          Tracking
        </FormLabel>
        <FormDescription>Specify the total number of hours for this budget</FormDescription>
        <FormNumberInput
          name="budget"
          placeHolder="Enter total hours"
          error={!!errors?.budget?.message}
          suffix="/hrs"
        />
        {errors?.budget?.message && <FormErrorMessage>{errors.budget.message}</FormErrorMessage>}
      </FormControl>
    </Transition>
  )
}
