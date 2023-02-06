import { ReactNode } from 'react'
import { Tooltip } from 'react-tooltip'

type ToolTipProps = {
  id: string
  children: ReactNode
}

export const ToolTip = ({ id, children }: ToolTipProps): JSX.Element => {
  return (
    <Tooltip
      anchorId={id}
      offset={10}
      className="!bg-white shadow-md shadow-gray-50 !px-3 !py-2 !opacity-100 !inset-x-0 w-full z-10"
    >
      {children}
    </Tooltip>
  )
}
