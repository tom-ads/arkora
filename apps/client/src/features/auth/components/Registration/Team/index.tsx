import { Descriptor, DescriptorContent, DescriptorInsights, Divider, Form } from '@/components'
import UserRole from '@/enums/UserRole'
import { useRegisterMutation } from './../../../api'
import { clearRegistration, setTeam } from '@/stores/slices/registration'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { InviteTeam } from '../../Team/InviteTeam'
import { SelectedRole } from './../../../types'
import { RootState } from '@/stores/store'
import { Navigate } from 'react-router-dom'

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

const TeamFormSchema = z.array(
  z.object({
    email: z.string(),
    role: z.nativeEnum(UserRole),
  }),
)

export const TeamView = (): JSX.Element => {
  const dispatch = useDispatch()

  const { organisation, details, team } = useSelector((state: RootState) => state.registration)

  const [register, { isSuccess: didRegister }] = useRegisterMutation()

  const handleSubmit = (data: FormFields) => {
    dispatch(setTeam(data.team))
    register({
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
  }

  if (didRegister) {
    dispatch(clearRegistration())
    return <Navigate to="/login" />
  }

  return (
    <Form<FormFields, typeof TeamFormSchema>
      className="gap-0"
      onSubmit={handleSubmit}
      validationSchema={TeamFormSchema}
      defaultValues={{
        email: '',
        role: {
          value: UserRole.MEMBER,
          children: 'Member',
        },
        team: [
          {
            email: 'ta@example.commmmmmmmmmmmmm',
            role: {
              value: UserRole.MEMBER,
              children: 'Member',
            },
          },
        ],
      }}
    >
      {(methods) => (
        <>
          <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20 min-h-[650px]">
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
                description="Invite the team to the organisation"
                className="max-w-md md:max-w-[325px]"
              />

              {/* Team Members */}
              <DescriptorContent className="max-w-[405px]">
                <InviteTeam {...methods} />
              </DescriptorContent>
            </Descriptor>
          </div>
        </>
      )}
    </Form>
  )
}
