import { ReactNode } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

type ToolTipProps = {
  width: number
  trigger: JSX.Element
  children: ReactNode
}

export const ToolTip = ({ width, trigger, children }: ToolTipProps): JSX.Element => {
  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={500}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button" className="outline-none w-full">
            {trigger}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            style={{ width }}
            className="bg-white shadow-md shadow-gray-50 py-2 px-3 rounded-sm select-none"
          >
            {children}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
