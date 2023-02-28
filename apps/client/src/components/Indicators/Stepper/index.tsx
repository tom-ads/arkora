import classNames from 'classnames'
import { useContext, createContext, ReactNode } from 'react'

type StepperContext = {
  activeStep: number
}

const StepperContext = createContext<StepperContext>({ activeStep: 0 })

export const Step = ({ id, children }: { id: number; children: ReactNode }): JSX.Element => {
  const { activeStep } = useContext<StepperContext>(StepperContext)

  const Connector = () => {
    return (
      <div
        className={classNames('h-[2px] w-full rounded-full transition-all', {
          'bg-purple-90': activeStep >= id,
          'bg-gray-40': activeStep < id,
        })}
      ></div>
    )
  }

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <span
        className={classNames('font-medium capitalize', {
          'text-purple-90': activeStep >= id,
          'text-gray-40': activeStep < id,
        })}
      >
        {children}
      </span>
      <div className="flex items-center gap-1 w-full">
        <Connector />
        <div
          className={classNames(
            'w-8 h-8 lg:w-9 lg:h-9 grid place-content-center border-2 rounded-full shrink-0 transition-all',
            {
              'border-purple-90': activeStep >= id,
              'bg-none border-gray-40': activeStep < id,
            },
          )}
        >
          <div
            className={classNames(
              'rounded-full grid place-content-center w-6 h-6 lg:w-7 lg:h-7 transition-all',
              {
                'text-purple-90': activeStep === id,
                'bg-purple-90 text-white': activeStep > id,
                'bg-none text-gray-40': activeStep < id,
              },
            )}
          >
            <span className="font-medium text-base lg:text-lg">{id + 1}</span>
          </div>
        </div>
        <Connector />
      </div>
    </div>
  )
}

type StepIndicatorProps = {
  className?: string
  children: JSX.Element[]
  activeStep: number
}

export const Stepper = ({ activeStep, className, children }: StepIndicatorProps): JSX.Element => {
  return (
    <StepperContext.Provider value={{ activeStep: activeStep }}>
      <div className={classNames('w-full flex justify-center gap-4 lg:gap-6 py-3', className)}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}
