import { CrossIcon } from '@/components/Icons/CrossIcon'
import { TickIcon } from '@/components/Icons/TickIcon'
import { useIsDirty } from '@/hooks/useIsDirty'
import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useMemo } from 'react'

type CriteriaFields = {
  achieved: boolean
  suggestion: string
}

type Criteria = Record<string, CriteriaFields>

const CriteriaSuggestion = ({ criteria }: { criteria: CriteriaFields }) => {
  return (
    <div className="flex items-center gap-x-2 transition-all duration-1000">
      <div
        className={classNames(
          'h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200',
          {
            'bg-red-10': !criteria.achieved,
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
        className={classNames('font-medium text-xs transition-colour duration-200', {
          'text-green-90': criteria.achieved,
          'text-red-90': !criteria.achieved,
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
      className={classNames('rounded w-full h-[3px] transition-colors', {
        'ease-linear duration-300 bg-gradient-to-r from-green-90 to bg-green-90':
          scoreFactor === threshold,
        'bg-green-90': scoreFactor > threshold,
        'bg-red-90': scoreFactor < threshold,
      })}
    ></div>
  )
}

type PasswordStrengthProps = {
  password: string
  hideSuggestions?: boolean
  isError: boolean
}

export const PasswordStrength = ({
  password,
  hideSuggestions,
  isError,
}: PasswordStrengthProps): JSX.Element => {
  const [isDirty, { reset }] = useIsDirty(password)

  const { scoreFactor, criterias } = useMemo(() => {
    let scoreFactor = 0

    const criterias: Criteria = {
      charCount: {
        achieved: password?.length >= 8,
        suggestion: 'Contains at least 8 characters',
      },
      uppercase: {
        achieved: /[A-Z]+/.test(password),
        suggestion: 'Contains one uppercase character',
      },
      lowercase: {
        // NOTE: this will return true as JS uses type coercion to convert it into "undefined"
        achieved: /[a-z]+/.test(password),
        suggestion: 'Contains one lowercase character',
      },
      number: {
        achieved: /[0-9]+/.test(password),
        suggestion: 'Contains one number',
      },
      symbol: {
        achieved: /[~!@#$£%^&*]+/.test(password),
        suggestion: 'Contains one special character ([ ~ ! @ # $ £ % ^ & *)',
      },
    }

    scoreFactor = password ? Object.values(criterias).filter((p) => p.achieved)?.length : 0

    return { scoreFactor, criterias }
  }, [password])

  useEffect(() => {
    if (isDirty && !password) {
      reset()
    }
  }, [isDirty, password])

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

      {!hideSuggestions && (
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
      )}
    </div>
  )
}
