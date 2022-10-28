import { CrossIcon } from '@/components/Icons/CrossIcon'
import { TickIcon } from '@/components/Icons/TickIcon'
import { useIsDirty } from '@/hooks/useIsDirty'
import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useMemo } from 'react'

type TCriteriaFields = {
  achieved: boolean
  suggestion: string
}

type TCriteria = { [k: string]: TCriteriaFields }

const CriteriaSuggestion = ({ criteria }: { criteria: TCriteriaFields }) => {
  return (
    <div className="flex items-center gap-x-2 transition-all duration-1000">
      <div
        className={classNames(
          'bg-red-10 h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200',
          {
            'bg-green-10': criteria.achieved,
          },
        )}
      >
        {criteria.achieved ? (
          <TickIcon className={classNames('text-green-90 w-3 h-3')} />
        ) : (
          <CrossIcon className={classNames('text-red-90 w-3 h-3')} />
        )}
      </div>
      <p
        className={classNames('text-red-90 font-medium text-xs transition-colour duration-200', {
          'text-green-90': criteria.achieved,
        })}
      >
        {criteria.suggestion}
      </p>
    </div>
  )
}

const IndicatorBar = ({ threshold, scoreFactor }: { threshold: number; scoreFactor: number }) => {
  return (
    <div
      className={classNames('rounded w-full h-[3px] bg-red-90 transition-colors', {
        'ease-linear duration-300 bg-gradient-to-r from-green-90 to bg-green-90':
          scoreFactor === threshold,
        'bg-green-90': scoreFactor > threshold,
      })}
    ></div>
  )
}

type PasswordStrengthProps = {
  password: string
  isError: boolean
}

export const PasswordStrength = ({ password, isError }: PasswordStrengthProps): JSX.Element => {
  const isDirty = useIsDirty(password)

  const { scoreFactor, criterias } = useMemo(() => {
    let scoreFactor = 0

    const criterias: TCriteria = {
      charCount: {
        achieved: password?.length >= 8,
        suggestion: 'At least 8 characters long',
      },
      uppercase: {
        achieved: /[A-Z]+/.test(password),
        suggestion: 'Contain one uppercase character',
      },
      lowercase: {
        achieved: /[a-z]+/.test(password),
        suggestion: 'Contain one lowercase character',
      },
      number: {
        achieved: /[0-9]+/.test(password),
        suggestion: 'Contain one number',
      },
      symbol: {
        achieved: /[~!@#$£%^&*]+/.test(password),
        suggestion: 'Contain one special character ([ ~ ! @ # $ £ % ^ & *)',
      },
    }

    scoreFactor = Object.values(criterias).filter((p) => p.achieved)?.length

    return { scoreFactor, criterias }
  }, [password])

  return (
    <div className="flex flex-col w-full gap-y-3 mt-2">
      <div className="flex gap-2 w-full">
        {Array.from({ length: 5 }).map((_, idx) => (
          <IndicatorBar
            key={`password-indicator-${idx}`}
            threshold={idx + 1}
            scoreFactor={scoreFactor}
          />
        ))}
      </div>

      <Transition
        show={(isDirty && scoreFactor !== 5) || isError}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex flex-col gap-y-2">
          {Object.keys(criterias).map((criterion) => (
            <CriteriaSuggestion key={criterion} criteria={criterias[criterion]} />
          ))}
        </div>
      </Transition>
    </div>
  )
}
