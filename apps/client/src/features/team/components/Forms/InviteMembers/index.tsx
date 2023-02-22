import {
  Button,
  Form,
  FormControl,
  FormInput,
  HorizontalDivider,
  MouseIcon,
  UploadIcon,
} from '@/components'
import FormDroppable from '@/components/Forms/Droppable'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { ModalFooter } from '@/components/Modal'
import UserRole from '@/enums/UserRole'
import { useInviteMembersMutation } from '@/features/auth'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { InviteMemberList } from '../../Lists/InviteMembers'
import { ImportMemberModal } from '../../Modals'

export type SelectedMember = {
  email: string
  role: Omit<UserRole, 'Owner'>
}

export type InviteMemberFormFields = {
  email: string | null
  selectedFile: File | null
  containsHeaders: boolean
  selectedHeader: string | null
  members: SelectedMember[]
}

const inviteMembersSchema = z.object({
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
}: UseFormReturn<InviteMemberFormFields>): JSX.Element => {
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
      <FormDroppable
        containerStyling="h-36"
        onChange={(file: File[]) => setValue('selectedFile', file?.[0])}
        acceptedMimes={{
          'text/csv': ['.csv'],
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        }}
      >
        <div className="flex items-center justify-center gap-1 mb-1 text-purple-90">
          <UploadIcon className="w-7 h-7 flex-shrink-0" />
          <p className="text-gray-100 text-md">
            <span className="font-semibold">Click</span> or{' '}
            <span className="font-semibold">Drag</span> To Upload
          </p>
        </div>

        <p className="text-gray-80 text-sm text-center">
          <span className="font-medium">XLXS</span> or <span className="font-medium">CSV</span>{' '}
          Format - Max Size (12MB)
        </p>
      </FormDroppable>

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
          </Button>{' '}
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
          contentRight={
            <div className="flex items-center gap-1 text-gray-80">
              <MouseIcon className="w-5 h-5 shrink-0" />
              <p className="whitespace-nowrap text-sm font-medium">Scroll to view list</p>
            </div>
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

  const handleSubmit = async (data: InviteMemberFormFields) => {
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
    <Form<InviteMemberFormFields, typeof inviteMembersSchema>
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
            <Button variant="blank" danger>
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
