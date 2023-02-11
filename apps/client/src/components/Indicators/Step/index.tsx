import classNames from 'classnames'
import { ReactNode, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

type StepProps = {
  id: string
  text: string
}

export const Step = ({ id, text }: StepProps): JSX.Element => {
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

type StepIndicatorProps = {
  className?: string
  children: ReactNode
  activeStep: string
  defaultStep: string
}

export const StepIndicator = ({
  activeStep,
  defaultStep,
  className,
  children,
}: StepIndicatorProps): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('step') !== activeStep) {
      setSearchParams({ step: activeStep })
    }
  }, [activeStep])

  useEffect(() => {
    if (!searchParams.get('step')) {
      setSearchParams({ step: defaultStep })
    }
  }, [])

  return (
    <div className={classNames('w-full flex justify-center gap-8 lg:gap-16 py-3', className)}>
      {children}
    </div>
  )
}
