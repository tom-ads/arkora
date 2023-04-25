import { ReactNode } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import classNames from 'classnames'

type ToolTipProps = {
  width: number
  trigger: JSX.Element
  delay?: number
  disabled?: boolean
  tipFill?: string
  className?: string
  children: ReactNode
}

export const ToolTip = ({
  width,
  trigger,
  delay,
  tipFill,
  disabled,
  className,
  children,
}: ToolTipProps): JSX.Element => {
  if (disabled) {
    return trigger
  }

  return (
    <Tooltip.Provider delayDuration={delay ?? 300} skipDelayDuration={500}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            style={{ width }}
            className={classNames(
              'bg-white shadow-md shadow-gray-50 py-2 px-3 rounded-sm select-none',
              className,
            )}
          >
            {children}
            <Tooltip.Arrow className={tipFill ?? 'fill-white'} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
