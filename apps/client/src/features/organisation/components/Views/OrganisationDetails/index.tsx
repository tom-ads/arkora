import { FormControl, FormErrorMessage, FormInput, FormLabel } from '@/components'
import { OrganisationWithTasksFormFields } from '@/features/organisation'
import { ModalBaseProps } from '@/types'
import { UseFormReturn } from 'react-hook-form'

type OrganisationDetailsViewProps = ModalBaseProps & UseFormReturn<OrganisationWithTasksFormFields>

export const OrganisationDetailsView = ({
  formState,
  watch,
}: OrganisationDetailsViewProps): JSX.Element => {
  return (
    <>
      <FormControl>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormInput name="name" placeHolder="Enter name" error={!!formState.errors?.name?.message} />
        {formState.errors?.name?.message && (
          <FormErrorMessage>{formState.errors?.name?.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="subdomain">Subdomain</FormLabel>
        <FormInput name="subdomain" placeHolder="Enter subdomain" disabled={!!watch('subdomain')} />
      </FormControl>
    </>
  )
}
