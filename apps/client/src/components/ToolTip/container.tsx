import { ReactNode } from 'react'

type ToolTipContainerProps = {
  children: ReactNode
}

export const ToolTipContainer = ({ children }: ToolTipContainerProps): JSX.Element => {
  return <div className="relative w-full">{children}</div>
}
