import { Descriptor, DescriptorContent, DescriptorInsights, Divider, Form } from '@/components'
import UserRole from '@/enums/UserRole'
import { z } from 'zod'
import { InviteTeam } from '../../Team/InviteTeam'

type SelectRole = {
  value: UserRole
  children: string
}

export interface TeamProps {
  team: Array<{
    email: string
    role: SelectRole
  }>
}

type FormFields = {
  email: string
  role: SelectRole
} & TeamProps

const TeamFormSchema = z.array(
  z.object({
    email: z.string(),
    role: z.nativeEnum(UserRole),
  }),
)

export const TeamView = ({ onSuccess }: { onSuccess: () => void }): JSX.Element => {
  const handleSubmit = (data: FormFields) => {
    console.log(data)
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
