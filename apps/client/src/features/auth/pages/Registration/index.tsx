import { DetailsView, OrganisationsView, TeamView } from '../../components/Registration'
import { RegistrationSteps } from '../../types'
import { useDispatch, useSelector } from 'react-redux'
import { setStep } from '@/stores/slices/registration'
import { RootState } from '@/stores/store'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Step, StepIndicator } from '@/components'

// const views = {
//   details: {
//     title: 'Your details',
//     description: 'Let’s get started! We need to collect some details and setup your account',
//     view: (handleStep: () => void) => <DetailsView onSuccess={handleStep} />,
//   },
//   organisation: {
//     title: 'Create organisation',
//     description:
//       'Let’s setup your organisation. It’ll be home to everything your team does on Arkora',
//     view: (handleStep: () => void) => <OrganisationsView onBack={} onSuccess={handleStep} />,
//   },
// }

export const RegistrationPage = (): JSX.Element => {
  useDocumentTitle('Register')

  const dispatch = useDispatch()

  const activeStep = useSelector((state: RootState) => state.registration.misc?.step)

  const handleStep = (step: RegistrationSteps) => {
    dispatch(setStep({ step }))
  }

  return (
    <div className="flex flex-col py-11">
      <StepIndicator activeStep={activeStep} defaultStep="details">
        <Step id="details" text="Your details" />
        <Step id="organisation" text="Create organisation" />
        <Step id="team" text="Invite the team" />
      </StepIndicator>

      <div className="my-8">
        {activeStep === 'details' && <DetailsView onSuccess={handleStep} />}
        {activeStep === 'organisation' && (
          <OrganisationsView onBack={handleStep} onSuccess={handleStep} />
        )}
        {activeStep === 'team' && <TeamView onBack={handleStep} />}
      </div>
    </div>
  )
}

export default RegistrationPage
