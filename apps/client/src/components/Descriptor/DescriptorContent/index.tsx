import { ReactNode } from 'react'

type DescriptorContentProps = {
  className?: string
  children: ReactNode
}

export const DescriptorContent = ({ className, children }: DescriptorContentProps): JSX.Element => {
  return <div className={className}>{children}</div>
}
