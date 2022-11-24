import { ModalBaseProps } from '@/types'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'
import { ModalHeader } from '../ModalHeader'

type ModalRootProps = ModalBaseProps & {
  icon: JSX.Element
  title: string
  description?: string
  children: ReactNode
}

export const Modal = ({
  title,
  description,
  icon,
  isOpen,
  onClose,
  children,
}: ModalRootProps): JSX.Element => {
  return (
    <Transition show={isOpen} as={Fragment} appear>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-90 bg-opacity-20" aria-hidden="true" />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex items-center justify-center lg:p-4">
            <Dialog.Panel className="rounded bg-white mx-auto max-w-xl w-full flex flex-col divide-y divide-gray-30 shadow-glow">
              <ModalHeader title={title} description={description} icon={icon} onClose={onClose} />
              <div className="w-full pt-6 pb-8 px-8">{children}</div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
