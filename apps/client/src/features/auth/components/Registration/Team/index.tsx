import {
  Button,
  Descriptor,
  DescriptorContent,
  DescriptorInsights,
  Divider,
  Form,
} from '@/components'
import UserRole from '@/enums/UserRole'
import { useRegisterMutation } from './../../../api'
import { clearRegistration, setTeam } from '@/stores/slices/registration'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { InviteTeam } from '../../Team/InviteTeam'
import { RegistrationSteps, SelectedRole } from './../../../types'
import { RootState } from '@/stores/store'
import { isEqual } from 'lodash'
import { Navigate, useNavigate } from 'react-router-dom'

export interface TeamProps {
  team: Array<{
    email: string
    role: SelectedRole
  }>
}

type FormFields = {
  email: string
  role: SelectedRole
} & TeamProps

const TeamFormSchema = z.object({
  team: z.array(
    z.object({
      email: z.string(),
      role: z.object({
        value: z.nativeEnum(UserRole),
        children: z.string(),
      }),
    }),
  ),
})

type TeamViewProps = {
  onBack: (prevStep: RegistrationSteps) => void
}

export const TeamView = ({ onBack }: TeamViewProps): JSX.Element => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { organisation, details, team } = useSelector((state: RootState) => state.registration)

  const [register, { isLoading: isRegistering, isSuccess: didRegister }] = useRegisterMutation()

  const handleSubmit = async (data: FormFields) => {
    dispatch(setTeam({ ...data.team }))
    await register({
      firstname: details.firstname,
      lastname: details.lastname,
      email: details.email,
      password: details.password,
      password_confirmation: details.password,

      name: organisation.name,
      subdomain: organisation.subdomain,
      opening_time: organisation.openingTime,
      closing_time: organisation.closingTime,
      work_days: organisation.workDays,
      currency: organisation.currency.value,
      hourly_rate: parseInt(organisation.hourlyRate, 10),

      team: team.map((member) => ({
        email: member.email,
        role: member.role.value,
      })),
    })
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true, state: { location: '/' } })
        window.location.host = `${organisation.subdomain}.${
          import.meta.env.VITE_ARKORA_STATIC_HOSTNAME
        }`
        dispatch(clearRegistration())
      })
  }

  const handleFormChange = (data: FormFields) => {
    if (!isEqual(team, data.team)) {
      dispatch(setTeam(data.team))
    }
  }

  return (
    <Form<FormFields, typeof TeamFormSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      validationSchema={TeamFormSchema}
      defaultValues={{
        email: '',
        role: {
          value: UserRole.MEMBER,
          children: 'Member',
        },
        team: team ?? [],
      }}
    >
      {(methods) => (
        <>
          <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20 min-h-[600px]">
            <div className="space-y-2 pb-6">
              <h1 className="font-semibold text-[32px] text-gray-100">Create organisation</h1>
              <p className="text-base text-gray-80">
                Almost there! Define your organisation teams and invite your team members
              </p>
            </div>

            <Divider />

            <Descriptor>
              <DescriptorInsights
                title="Team Members"
                description="Start inviting the team, or invite them later"
                className="max-w-md md:max-w-[325px]"
              />

              {/* Team Members */}
              <DescriptorContent className="max-w-[405px]">
                <InviteTeam {...methods} />
              </DescriptorContent>
            </Descriptor>
          </div>

          <div className="flex justify-between mt-12">
            <button
              type="button"
              className="outline-none text-purple-90 font-semibold text-base hover:text-purple-70"
              onClick={() => onBack('organisation')}
            >
              Previous Step
            </button>
            <Button
              size="sm"
              className="max-w-[220px] w-full"
              type="submit"
              isLoading={isRegistering}
            >
              Finish
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}
