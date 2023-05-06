import { InfoCircleIcon } from '@/components/Icons'
import { ToolTip } from '@/components/ToolTip'
import { HTMLAttributes, ReactNode } from 'react'

interface FormLabelInfoProps extends HTMLAttributes<HTMLLabelElement> {
  width?: number
  children: ReactNode
}

export const FormLabelInfo = ({ width = 200, children }: FormLabelInfoProps) => {
  return (
    <ToolTip
      width={width}
      trigger={
        <button type="button" className="outline-none mb-2">
          <InfoCircleIcon className="w-5 h-5 text-purple-90" />
        </button>
      }
    >
      {children}
    </ToolTip>
  )
}
