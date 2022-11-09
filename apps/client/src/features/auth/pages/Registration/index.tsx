import { useState } from 'react'
import Progress from '@/components/Indicators/Progress'
import { ProgressStep } from '@/components/Indicators/ProgressStep'
import { DetailsView, OrganisationsView, TeamView } from '../../components/Registration'
import { RegistrationSteps } from '../../types'

export const RegistrationPage = (): JSX.Element => {
  const [activeStep, setActiveStep] = useState<RegistrationSteps>('details')

  const handleStep = (nextStep?: RegistrationSteps) => {
    if (nextStep) {
      setActiveStep(nextStep)
      return
    }
  }

  const handleBack = (prevStep: RegistrationSteps) => {
    setActiveStep(prevStep)
  }

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
          <OrganisationsView onBack={handleBack} onSuccess={handleStep} />
        )}
        {activeStep === 'team' && <TeamView />}
      </div>
    </div>
  )
}

export default RegistrationPage
