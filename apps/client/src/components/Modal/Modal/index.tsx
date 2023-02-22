import { Spinner } from '@/components/Spinner'
import { ModalBaseProps } from '@/types'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, ReactNode } from 'react'
import { ModalHeader } from '../ModalHeader'

type ModalProps = ModalBaseProps & {
  icon?: JSX.Element
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export const Modal = ({
  title,
  description,
  icon,
  isOpen,
  onClose,
  afterLeave,
  loading,
  className,
  children,
}: ModalProps): JSX.Element => {
  return (
    <Transition show={isOpen} as={Fragment} afterLeave={afterLeave} appear>
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
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center lg:p-4">
              <Dialog.Panel
                className={classNames(
                  'relative rounded bg-white mx-auto max-w-xl w-full flex flex-col divide-y divide-gray-30 shadow-glow min-h-[500px]',
                  className,
                )}
              >
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner className="text-purple-90 w-12 h-12 stroke-[10px]" />
                  </div>
                ) : (
                  <>
                    <ModalHeader
                      title={title}
                      description={description}
                      icon={icon}
                      onClose={onClose}
                    />
                    <div className="w-full pt-6 pb-8 px-8">{children}</div>
                  </>
                )}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
