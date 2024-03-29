import {
  FormControl,
  FormLabel,
  UserIcon,
  Form,
  FormInput,
  ReadOnly,
  Button,
  FormatDateTime,
  FormSelect,
  FormErrorMessage,
} from '@/components'
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
import { camelCase, startCase } from 'lodash'
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

  const [updateMember, { isLoading: updatingMember, error }] = useUpdateAccountMutation()

  const [deleteMember, { isLoading: deletingMember }] = useDeleteAccountMutation()

  const { authUser } = useSelector((state: RootState) => ({
    authUser: state.auth.user,
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
      .catch((error) => {
        if (error.state === 422) return
        errorToast(
          `Unable to update ${data.forename ?? 'Member'} at the moment, please try again later`,
        )
      })

    props.onClose()
  }

  const onConfirm = async () => {
    const name = member?.firstname ?? 'Member'
    await deleteMember(member!.id)
      .then(() => successToast(`${name} has been removed`))
      .catch(() => errorToast(`Unable to remove ${name}, please try again later.`))

    setOpenConfirmationModal(false)
    setTimeout(() => props.onClose(), 100)
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
      icon={<UserIcon />}
      isOpen={props.isOpen}
      onClose={props.onClose}
      loading={fetchingMember}
      className="max-w-[500px]"
    >
      <Form<FormFields, typeof manageMemberSchema>
        onSubmit={handleSubmit}
        defaultValues={{
          forename: member?.firstname ?? '',
          surname: member?.lastname ?? '',
          email: member?.email?.toLowerCase() ?? '',
          role: member?.role?.name ?? null,
        }}
        className="space-y-6"
        queryError={error}
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
              {(authUser?.role?.name === UserRole.ORG_ADMIN ||
                authUser?.role?.name === UserRole.OWNER) &&
              member?.role?.name !== UserRole.OWNER ? (
                <FormSelect name="role" control={control} placeHolder="Select role" fullWidth>
                  {roleOptions?.map((option) => (
                    <SelectOption key={option.id} id={option.id}>
                      {option?.display}
                    </SelectOption>
                  ))}
                </FormSelect>
              ) : (
                <ReadOnly value={camelCase(startCase(watch('role') ?? ''))} />
              )}
            </FormControl>

            <ModalFooter className="!mt-24">
              {authUser?.id !== member?.id || member?.role?.name !== UserRole.OWNER ? (
                <Button
                  variant="blank"
                  onClick={() => setOpenConfirmationModal(true)}
                  disabled={updatingMember || deletingMember}
                  danger
                >
                  Remove
                </Button>
              ) : (
                <span></span>
              )}

              <Button size="xs" type="submit" loading={updatingMember} disabled={deletingMember}>
                Update {member?.firstname ?? 'Member'}
              </Button>
            </ModalFooter>

            <ConfirmationModal
              isOpen={openConfirmationModal}
              onClose={() => setOpenConfirmationModal(false)}
              onConfirm={onConfirm}
              loading={deletingMember}
              title={`You're about to remove ${member?.firstname ?? 'a member'}`}
              btnText={`Remove ${member?.firstname ?? 'Member'}`}
              description="Performing this action will permanently remove all related time entries for this member. It cannot be recovered."
            />
          </>
        )}
      </Form>
    </Modal>
  )
}
