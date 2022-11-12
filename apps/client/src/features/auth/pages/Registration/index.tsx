import Progress from '@/components/Indicators/Progress'
import { ProgressStep } from '@/components/Indicators/ProgressStep'
import { DetailsView, OrganisationsView, TeamView } from '../../components/Registration'
import { RegistrationSteps } from '../../types'
import { useDispatch, useSelector } from 'react-redux'
import { setStep } from '@/stores/slices/registration'
import { RootState } from '@/stores/store'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const RegistrationPage = (): JSX.Element => {
  useDocumentTitle('Register')

  const dispatch = useDispatch()

  const activeStep = useSelector((state: RootState) => state.registration.misc?.step)

  const handleStep = (step: RegistrationSteps) => {
    dispatch(setStep({ step }))
  }

  // TODO: reset registration state on page visit / leave

  return (
    <div className="flex flex-col py-11">
      <Progress activeStep={activeStep} defaultStep="details">
        <ProgressStep id="details" text="Your details" />
        <ProgressStep id="organisation" text="Create organisation" />
        <ProgressStep id="team" text="Invite the team" />
      </Progress>

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
