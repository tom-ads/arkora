import {
  FormControl,
  FormLabel,
  UsersIcon,
  Form,
  FormInput,
  ReadOnly,
  Button,
  FormatDateTime,
  FormSelect,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { SelectOption } from '@/components/Forms/Select/option'
import { Modal, ModalFooter } from '@/components/Modal'
import { ConfirmationModal } from '@/components/Modals'
import UserRole from '@/enums/UserRole'
import {
  useDeleteAccountMutation,
  useGetAccountQuery,
  useUpdateAccountMutation,
} from '@/features/account'
import { isFetchBaseQueryError } from '@/hooks/useQueryError'
import { useToast } from '@/hooks/useToast'
import { RootState } from '@/stores/store'
import { ModalBaseProps } from '@/types'
import { DateTime } from 'luxon'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

type FormFields = {
  forename: string | null
  surname: string | null
  email: string | null
  role: UserRole | null
}

const manageMemberSchema = z.object({
  forename: z.string().min(1, { message: 'Forename is required' }),
  surname: z.string().min(1, { message: 'Surname is required' }),
  role: z.nativeEnum(UserRole),
})

type ManageMemberModalProps = ModalBaseProps

export const ManageMemberModal = (props: ManageMemberModalProps): JSX.Element => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { memberId } = useParams()

  const { successToast, errorToast } = useToast()

  const [updateMember, { isLoading: updatingMember }] = useUpdateAccountMutation()

  const [deleteMember, { isLoading: deletingMember }] = useDeleteAccountMutation()

  const { authUserRole } = useSelector((state: RootState) => ({
    authUserRole: state.auth.user?.role?.name,
  }))

  const {
    data: member,
    isFetching: fetchingMember,
    error: fetchMemberError,
  } = useGetAccountQuery(parseInt(memberId!, 10), {
    skip: !memberId,
  })

  const handleSubmit = async (data: FormFields) => {
    await updateMember({
      id: member!.id,
      firstname: data.forename!,
      lastname: data.surname!,
      role: data.role!,
    })
      .unwrap()
      .then(() => successToast(`${data.forename ?? 'Member'} has been updated`))
      .catch(() =>
        errorToast(
          `Unable to update ${data.forename ?? 'Member'} at the moment, please try again later`,
        ),
      )

    props.onClose()
  }

  const onConfirm = async () => {
    const name = member?.firstname ?? 'Member'
    await deleteMember(member!.id)
      .then(() => successToast(`${name} has been deleted`))
      .catch(() => errorToast(`Unable to remove ${name}, please try again later.`))

    setOpenConfirmationModal(false)
    props.onClose()
  }

  const roleOptions = useMemo(
    () =>
      Object.values(UserRole)
        .filter((r) => r !== UserRole.OWNER)
        .map((role) => ({
          id: role,
          display: role.toLowerCase()?.replace('_', ' '),
        })),
    [],
  )

  useEffect(() => {
    if (isFetchBaseQueryError(fetchMemberError)) {
      if (fetchMemberError.status !== 422) {
        props.onClose()
      }
    }
  }, [fetchMemberError])

  return (
    <Modal
      title={`Manage ${member?.firstname ?? 'Member'}`}
      description="Update members information"
      icon={<UsersIcon />}
      isOpen={props.isOpen}
      onClose={props.onClose}
      loading={fetchingMember}
    >
      <Form<FormFields, typeof manageMemberSchema>
        onSubmit={handleSubmit}
        defaultValues={{
          forename: member?.firstname ?? null,
          surname: member?.lastname ?? null,
          email: member?.email ?? null,
          role: member?.role?.name ?? null,
        }}
        className="space-y-6"
        queryError={fetchMemberError}
        validationSchema={manageMemberSchema}
      >
        {({ watch, control, formState: { errors } }) => (
          <>
            <div className="flex gap-14">
              <div className="space-y-[2px]">
                <p className="font-semibold text-sm text-gray-50">Joined</p>
                <p className="font-semibold text-base text-gray-80">
                  {member?.verifiedAt ? (
                    <FormatDateTime value={member?.verifiedAt} format={DateTime.DATE_MED} />
                  ) : (
                    <span className="text-yellow-60">Pending</span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-sm text-gray-50">Last Active</p>
                <p className="font-semibold text-base text-gray-80">
                  <FormatDateTime value={member?.lastActiveAt} format={DateTime.DATE_MED} />
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <FormControl>
                <FormLabel htmlFor="forename">Forename</FormLabel>
                <FormInput
                  name="forename"
                  placeHolder="Enter Forename"
                  error={!!errors?.forename?.message}
                />
                {errors?.forename?.message && (
                  <FormErrorMessage>{errors.forename?.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="surname">Surname</FormLabel>
                <FormInput
                  name="surname"
                  placeHolder="Enter Surname"
                  error={!!errors?.surname?.message}
                />
                {errors?.surname?.message && (
                  <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
                )}
              </FormControl>
            </div>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <ReadOnly value={watch('email')} />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="surname">Role</FormLabel>
              {authUserRole === UserRole.ORG_ADMIN || authUserRole === UserRole.OWNER ? (
                <FormSelect name="role" control={control} placeHolder="Select role" fullWidth>
                  {roleOptions?.map((option) => (
                    <SelectOption key={option.id}>{option?.display}</SelectOption>
                  ))}
                </FormSelect>
              ) : (
                <ReadOnly value={watch('role')} />
              )}
            </FormControl>

            <ModalFooter className="!mt-24">
              <Button
                variant="blank"
                onClick={() => setOpenConfirmationModal(true)}
                disabled={updatingMember || deletingMember}
                danger
              >
                Remove
              </Button>
              <Button
                size="xs"
                className="max-w-[160px]"
                type="submit"
                loading={updatingMember}
                disabled={deletingMember}
                block
              >
                Update
              </Button>
            </ModalFooter>

            <ConfirmationModal
              isOpen={openConfirmationModal}
              onClose={() => setOpenConfirmationModal(false)}
              onConfirm={onConfirm}
              loading={deletingMember}
              title={`You're about to delete ${member?.firstname ?? 'a Member'}`}
              btnText={`Delete ${member?.firstname ?? 'Member'}`}
              description="Performing this action will permanently delete all related time entries. It cannot be recovered."
            />
          </>
        )}
      </Form>
    </Modal>
  )
}
