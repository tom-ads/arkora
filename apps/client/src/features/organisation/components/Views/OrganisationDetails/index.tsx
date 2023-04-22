import { Button, FormControl, FormErrorMessage, FormInput, FormLabel } from '@/components'
import { ConfirmationModal } from '@/components/Modals'
import { OrganisationWithTasksFormFields } from '@/features/organisation'
import { useDeleteOrganisationMutation } from './../../../api'
import { useAuthorization } from '@/hooks/useAuthorization'
import { useToast } from '@/hooks/useToast'
import { clearAuth } from '@/stores/slices/auth'
import { RootState } from '@/stores/store'
import { ModalBaseProps } from '@/types'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

type OrganisationDetailsViewProps = ModalBaseProps & UseFormReturn<OrganisationWithTasksFormFields>

export const OrganisationDetailsView = ({
  formState,
  watch,
}: OrganisationDetailsViewProps): JSX.Element => {
  const dispatch = useDispatch()

  const [openConfirmationMode, setOpenConfirmationModal] = useState(false)

  const organisationId = useSelector((state: RootState) => state.organisation.id)

  const { errorToast } = useToast()

  const { checkPermission } = useAuthorization()

  const [deleteOrganisation, { isLoading: deletingOrganisation }] = useDeleteOrganisationMutation()

  const handleConfirm = async () => {
    if (organisationId) {
      await deleteOrganisation(organisationId)
        .unwrap()
        .then(() => {
          dispatch(clearAuth())
          window.location.host = import.meta.env.VITE_ARKORA_STATIC_HOSTNAME
        })
        .catch(() =>
          errorToast(
            'We failed to delete your organisation, please contact our support or try again later.',
          ),
        )
    }
  }

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormInput
          name="name"
          placeHolder="Enter name"
          error={!!formState.errors?.name?.message}
          disabled={!checkPermission('organisation:update')}
        />
        {formState.errors?.name?.message && (
          <FormErrorMessage>{formState.errors?.name?.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="subdomain">Subdomain</FormLabel>
        <FormInput name="subdomain" placeHolder="Enter subdomain" disabled={!!watch('subdomain')} />
      </FormControl>

      {checkPermission('organisation:delete') && (
        <FormControl className="mt-10">
          <h3 className="font-semibold text-gray-80 mb-2 text-lg">Danger Zone</h3>
          <div className="border border-red-90 rounded-md px-4 py-3 flex items-center">
            <div>
              <p className="text-gray-100 font-semibold text-sm">Delete Organisation</p>
              <p className="text-xs">
                Performing this action will permanently the entire organisation from Arkora
              </p>
            </div>
            <Button
              className="!py-2 !min-h-0"
              size="xs"
              onClick={() => setOpenConfirmationModal(true)}
              danger
            >
              <span className="text-xs">Delete Organisation</span>
            </Button>
          </div>
        </FormControl>
      )}

      <ConfirmationModal
        isOpen={openConfirmationMode}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleConfirm}
        loading={deletingOrganisation}
        title="You're about to delete your organisation"
        btnText="Delete Organisation"
        description="Performing this action will permanently delete your organisation and all related information. It cannot be recovered."
      />
    </>
  )
}
