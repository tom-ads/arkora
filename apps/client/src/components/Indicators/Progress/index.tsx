import classNames from 'classnames'
import { ReactNode, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

type ProgressProps = {
  className?: string
  children: ReactNode
  activeStep: string
  defaultStep: string
}

const Progress = ({ activeStep, defaultStep, className, children }: ProgressProps): JSX.Element => {
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

export default Progress
