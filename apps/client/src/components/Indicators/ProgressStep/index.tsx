import classNames from 'classnames'
import { useSearchParams } from 'react-router-dom'

type ProgressStepProps = {
  id: string
  text: string
}

export const ProgressStep = ({ id, text }: ProgressStepProps): JSX.Element => {
  const [searchParams] = useSearchParams()

  const activeStep = searchParams.get('step') === id

  return (
    <div className="flex items-center gap-4 transition">
      <div
        className={classNames('bg-gray-50 rounded-full w-3 h-3 flex flex-shrink-0', {
          '!bg-purple-90': activeStep,
        })}
      ></div>
      <p className={classNames('text-gray-50 font-medium', { '!text-purple-90': activeStep })}>
        {text}
      </p>
    </div>
  )
}
