import { useState } from 'react'
import Progress from '@/components/Indicators/Progress'
import { ProgressStep } from '@/components/Indicators/ProgressStep'
import { DetailsView, OrganisationsView, TeamView } from '../../components/Views'

type RegistrationSteps = 'details' | 'organisation' | 'team'

const registrationViews = {
  details: <DetailsView />,
  organisation: <OrganisationsView />,
  team: <TeamView />,
}

export const RegistrationPage = (): JSX.Element => {
  const [activeStep, setActiveStep] = useState<RegistrationSteps>('details')

  return (
    <div className="flex flex-col py-11">
      <Progress activeStep={activeStep} defaultStep="details">
        <ProgressStep id="details" text="Your details" />
        <ProgressStep id="organisation" text="Create organisation" />
        <ProgressStep id="team" text="Invite the team" />
      </Progress>

      <div className="my-8">{registrationViews[activeStep]}</div>
    </div>
  )
}

export default RegistrationPage
