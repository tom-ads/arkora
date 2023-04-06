import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  HorizontalDivider,
  Form,
  FormControl,
  FormInput,
  FormErrorMessage,
  MouseIcon,
  List,
  Avatar,
  UserIcon,
  FormSelect,
  BinIcon,
} from '@/components'
import UserRole from '@/enums/UserRole'
import { useRegisterMutation } from './../../../api'
import { clearRegistration, setStep, setTeam } from '@/stores/slices/registration'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { RootState } from '@/stores/store'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '@/stores/slices/auth'
import { setOrganisation } from '@/stores/slices/organisation'
import { convertToPennies } from '@/helpers/currency'
import {
  DroppableInvite,
  ImportMemberModal,
  InviteFormFields,
  inviteMembersSchema,
} from '@/features/team'
import { UseFormReturn } from 'react-hook-form'
import { useMemo } from 'react'
import { SelectOption } from '@/components/Forms/Select/option'
import { isEqual } from 'lodash'

const InviteMemberList = ({ watch, control }: { watch: any; control: any }): JSX.Element => {
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

  if (!watch('members')?.length) {
    return (
      <div className="py-5 w-full text-center min-h-[169px]">
        <p className="font-medium text-md text-gray-50 whitespace-nowrap">No Member Invites</p>
      </div>
    )
  }

  return (
    <List<InviteFormFields, 'members'>
      name="members"
      control={control}
      listClassName="h-[250px] overflow-y-auto scrollbar-hide scroll-smooth snap-y"
      itemClassName="border border-gray-40 rounded px-3 py-2 w-full flex items-center justify-between"
    >
      {({ field, itemIdx, methods }) => (
        <>
          <div className="flex items-center">
            <Avatar className="w-7 h-7 mr-3">
              <UserIcon className="w-4 h-4" />
            </Avatar>
            <p className="text-gray-80 text-sm font-medium truncate max-w-[170px]">{field.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <FormControl className="w-[135px]">
              <FormSelect
                name={`members.${itemIdx}.role`}
                control={control}
                placeHolder="Select role"
                size="xs"
              >
                {roleOptions?.map((option) => (
                  <SelectOption key={option.id} id={option.id}>
                    {option?.display}
                  </SelectOption>
                ))}
              </FormSelect>
            </FormControl>
            <Button variant="blank" onClick={() => methods?.remove(itemIdx)}>
              <BinIcon className="w-5 text-red-90 hover:text-red-40 focus:text-red-90 focus-visible:text-red-40" />
            </Button>
          </div>
        </>
      )}
    </List>
  )
}

const InviteTeamFormFields = ({
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
      <DroppableInvite onChange={(file: File[]) => setValue('selectedFile', file?.[0])} />

      <div className="flex items-center gap-2">
        <HorizontalDivider />
        <span className="font-semibold text-sm text-gray-60">OR</span>
        <HorizontalDivider />
      </div>

      <FormControl>
        <div className="flex w-full gap-3">
          <FormInput
            size="xs"
            name="email"
            placeHolder="Enter email"
            error={!!errors?.email?.message}
          />
          <Button
            size="xs"
            onClick={handleAddInvite}
            disabled={!watch('email')}
            className="max-w-[100px]"
            block
          >
            Add
          </Button>
        </div>
        {!!errors.email?.message && (
          <FormErrorMessage size="sm">{errors.email?.message}</FormErrorMessage>
        )}
      </FormControl>

      <div className="pb-4">
        <HorizontalDivider
          contentLeft={
            <p className="whitespace-nowrap font-medium text-base text-gray-100">Invites</p>
          }
          contentRight={
            <div className="flex items-center gap-1 text-gray-80">
              <MouseIcon className="w-5 h-5 shrink-0" />
              <p className="whitespace-nowrap text-sm font-medium">Scroll list</p>
            </div>
          }
        />
      </div>

      <InviteMemberList watch={watch} control={control} />
    </>
  )
}

export const TeamView = (): JSX.Element => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { organisation, details, team } = useSelector((state: RootState) => state.registration)

  const [register, { isLoading: isRegistering }] = useRegisterMutation()

  const handleSubmit = async (data: InviteFormFields) => {
    dispatch(setTeam({ ...data.members }))
    await register({
      firstname: details.firstname,
      lastname: details.lastname,
      email: details.email,
      password: details.password,
      passwordConfirmation: details.password,

      name: organisation.name,
      subdomain: organisation.subdomain,
      openingTime: organisation.openingTime,
      closingTime: organisation.closingTime,
      businessDays: organisation.businessDays,
      currency: organisation.currency,
      defaultRate: convertToPennies(organisation.defaultRate ?? 0),

      members: team.map((member) => ({
        email: member.email,
        role: member.role,
      })),
    })
      .unwrap()
      .then((response) => {
        navigate('/timer', { replace: true, state: { location: '/' } })
        window.location.host = `${organisation.subdomain}.${
          import.meta.env.VITE_ARKORA_STATIC_HOSTNAME
        }`

        dispatch(setAuth(response.user))
        dispatch(setOrganisation(response.organisation))
        dispatch(clearRegistration())
      })
  }

  const handleFormChange = (data: InviteFormFields) => {
    if (!isEqual(team, data.members)) {
      dispatch(setTeam(data.members))
    }
  }

  return (
    <Form<InviteFormFields, typeof inviteMembersSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      validationSchema={inviteMembersSchema}
      defaultValues={{
        email: null,
        selectedFile: null,
        selectedHeader: null,
        containsHeaders: false,
        members: team,
      }}
    >
      {(methods) => (
        <>
          <Descriptor>
            <DescriptorInsights
              title="Team Members"
              description="Upload or manually invite team members"
              className="max-w-md md:max-w-[300px]"
            />

            <DescriptorContent className="max-w-[420px]">
              <InviteTeamFormFields {...methods} />
            </DescriptorContent>
          </Descriptor>

          <div className="flex justify-between mt-12">
            <Button variant="blank" onClick={() => dispatch(setStep({ step: 'organisation' }))}>
              Previous Step
            </Button>
            <Button
              size="sm"
              className="max-w-[220px] w-full"
              type="submit"
              loading={isRegistering}
            >
              Finish
            </Button>
          </div>

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
