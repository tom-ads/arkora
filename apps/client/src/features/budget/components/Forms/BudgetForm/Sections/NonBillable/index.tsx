import {
  FormControl,
  FormDescription,
  FormLabel,
  FormNumberInput,
  FormErrorMessage,
} from '@/components'

type NonBillableSectionProps = {
  errors: any
}

export const NonBillableSection = ({ errors }: NonBillableSectionProps): JSX.Element => {
  return (
    <>
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
    </>
  )
}
