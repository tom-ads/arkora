import {
  Button,
  Form,
  FormControl,
  FormInput,
  HorizontalDivider,
  FormErrorMessage,
} from '@/components'
import { ModalFooter } from '@/components/Modal'
import UserRole from '@/enums/UserRole'
import { useInviteMembersMutation } from '@/features/auth'
import { InviteFormFields } from '../../../types'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { DroppableInvite } from '../../DroppableInvite'
import { InviteMemberList } from '../../Lists/InviteMembers'
import { ImportMemberModal } from '../../Modals'

export const inviteMembersSchema = z.object({
  email: z.string().nullable(),
  members: z.array(
    z.object({
      email: z.string().email({ message: 'Must be a valid email address' }),
      role: z.nativeEnum(UserRole),
    }),
  ),
})

export const InviteMemberFields = ({
  getValues,
  setValue,
  control,
  setError,
  watch,
  formState: { errors },
}: UseFormReturn<InviteFormFields>): JSX.Element => {
  const handleAddInvite = () => {
    const email = getValues('email')?.toLowerCase()
    const emailValidation = z.string().email()

    const validation = Object.values({
      required: {
        test: email,
        errorMessage: 'Email is required',
      },
      valid: {
        test: emailValidation.safeParse(getValues('email'))?.success,
        errorMessage: 'Valid email required',
      },
      alreadyExists: {
        test: !getValues('members')?.some((member) => member.email?.toLowerCase() === email),
        errorMessage: 'Team member already in invite list',
      },
    })?.filter((v) => !v.test)

    if (validation?.length) {
      // Only return first error message each time
      setError('email', { message: validation?.[0]?.errorMessage })
      return
    }

    setValue('members', [
      ...getValues('members'),
      {
        email: getValues('email')!,
        role: UserRole.MEMBER,
      },
    ])

    setValue('email', null)
  }

  return (
    <>
      <DroppableInvite
        className="h-36"
        onChange={(file: File[]) => setValue('selectedFile', file?.[0])}
      />

      <div className="py-4 flex items-center gap-2">
        <HorizontalDivider />
        <span className="font-semibold text-sm text-gray-60">OR</span>
        <HorizontalDivider />
      </div>

      <FormControl>
        <div className="flex w-full gap-3">
          <FormInput
            name="email"
            placeHolder="Enter email"
            size="xs"
            error={!!errors?.email?.message}
          />
          <Button size="xs" onClick={handleAddInvite} disabled={!watch('email')}>
            Invite Member
          </Button>
        </div>
        {!!errors.email?.message && (
          <FormErrorMessage size="sm">{errors.email?.message}</FormErrorMessage>
        )}
      </FormControl>

      <div className="pt-6 pb-4">
        <HorizontalDivider
          contentLeft={
            <p className="whitespace-nowrap font-medium text-base text-gray-100">Invites</p>
          }
        />
      </div>

      <InviteMemberList watch={watch} control={control} />
    </>
  )
}

type InviteMembersFormProps = ModalBaseProps

export const InviteMembersForm = ({ onClose }: InviteMembersFormProps): JSX.Element => {
  const { successToast, errorToast } = useToast()

  const [triggerInvite] = useInviteMembersMutation()

  const handleSubmit = async (data: InviteFormFields) => {
    await triggerInvite({ members: data.members })
      .unwrap()
      .then(() => {
        onClose()
        successToast('Members have been invited to the organisation')
      })
      .catch((error) => {
        if (error?.status !== 422) {
          errorToast('Unable to invite members, please try again later.')
          onClose()
        }
      })
  }

  return (
    <Form<InviteFormFields, typeof inviteMembersSchema>
      className="flex-grow"
      onSubmit={handleSubmit}
      validationSchema={inviteMembersSchema}
      defaultValues={{
        email: null,
        selectedFile: null,
        selectedHeader: null,
        containsHeaders: false,
        members: [],
      }}
    >
      {(methods) => (
        <>
          <InviteMemberFields {...methods} />

          <ModalFooter>
            <Button variant="blank" onClick={onClose} danger>
              Cancel
            </Button>
            <Button
              block
              size="xs"
              type="submit"
              className="max-w-[200px]"
              disabled={!methods.watch('members')?.length}
            >
              Invite {methods.watch('members')?.length ?? 0} Members
            </Button>
          </ModalFooter>

          <ImportMemberModal
            isOpen={!!methods.watch('selectedFile')}
            onClose={() => !methods.watch('selectedFile')}
            {...methods}
          />
        </>
      )}
    </Form>
  )
}
