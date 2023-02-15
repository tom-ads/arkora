import classNames from 'classnames'
import { ReactNode } from 'react'
import { Tooltip } from 'react-tooltip'

type ToolTipProps = {
  id: string
  className?: string
  children: ReactNode
}

export const ToolTip = ({ id, className, children }: ToolTipProps): JSX.Element => {
  return (
    <Tooltip
      anchorId={id}
      offset={10}
      className={classNames(
        '!bg-white shadow-md shadow-gray-50 py-2 px-3 !opacity-100 !inset-x-0 w-full z-10',
        className,
      )}
    >
      {children}
    </Tooltip>
  )
}
