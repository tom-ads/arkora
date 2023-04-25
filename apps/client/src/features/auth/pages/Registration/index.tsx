import { DetailsView, OrganisationsView, TeamView } from '../../components'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { HorizontalDivider, Step, Stepper } from '@/components'
import { useMemo } from 'react'

const registrationViews = {
  details: {
    id: 0,
    title: 'Your details',
    description: 'Let’s get started! We need to collect some details and setup your account',
  },
  organisation: {
    id: 1,
    title: 'Create organisation',
    description:
      'Let’s setup your organisation. It’ll be home to everything your team does on Arkora',
  },
  team: {
    id: 2,
    title: 'Invite the team',
    description: 'Almost there! Start early and invite the team, or do it later!',
  },
}

export const RegistrationPage = (): JSX.Element => {
  useDocumentTitle('Register')

  const step = useSelector((state: RootState) => state.registration.misc.step)

  const activeView = useMemo(() => {
    const id = step === 'details' ? 0 : step === 'organisation' ? 1 : 2
    return Object.values(registrationViews)?.[id]
  }, [step])

  return (
    <div className="flex flex-col py-11">
      <Stepper activeStep={activeView.id} className="px-3">
        {Object.values(registrationViews).map((step, idx) => (
          <Step key={step.title} id={idx}>
            {step.title}
          </Step>
        ))}
      </Stepper>

      <div className="my-8">
        <div className="bg-white rounded py-9 px-8 shadow-sm shadow-gray-20">
          <div className="space-y-2 pb-5">
            <h1 className="font-semibold text-3xl text-gray-100">{activeView.title}</h1>
            <p className="text-base text-gray-80">{activeView.description}</p>
          </div>

          <HorizontalDivider />

          {step === 'details' && <DetailsView />}
          {step === 'organisation' && <OrganisationsView />}
          {step === 'team' && <TeamView />}
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
