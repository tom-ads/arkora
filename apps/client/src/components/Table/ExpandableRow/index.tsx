import { Transition } from '@headlessui/react'
import { ReactNode } from 'react'

type ExpandableRowProps = {
  show: boolean
  children: ReactNode
}

export const ExpandableRow = ({ show, children }: ExpandableRowProps): JSX.Element => {
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as="tr"
    >
      {children}
    </Transition>
  )
}
