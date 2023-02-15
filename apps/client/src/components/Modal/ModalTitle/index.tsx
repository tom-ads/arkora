import { Dialog } from '@headlessui/react'
import { ReactNode } from 'react'

type ModalTitleProps = {
  children: ReactNode
}

export const ModalTitle = ({ children }: ModalTitleProps): JSX.Element => {
  return <Dialog.Title className="font-semibold text-gray-100 text-2xl">{children}</Dialog.Title>
}
