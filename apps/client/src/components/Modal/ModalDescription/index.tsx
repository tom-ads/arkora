import { ReactNode } from 'react'

type ModalDescriptionProps = {
  children: ReactNode
}

export const ModalDescription = ({ children }: ModalDescriptionProps): JSX.Element => {
  return <p className="text-base text-gray-80 leading-5">{children}</p>
}
