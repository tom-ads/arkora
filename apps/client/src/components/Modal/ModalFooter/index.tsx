import { ReactNode } from 'react'

type ModalFooterProps = {
  children: ReactNode
}

export const ModalFooter = ({ children }: ModalFooterProps): JSX.Element => {
  return <div className="w-full flex justify-between gap-x-2 mt-6">{children}</div>
}
