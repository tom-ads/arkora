import { Button } from '@/components/Button'
import { AlertOctagon } from '@/components/Icons/AlertOctagon'
import { ModalDescription } from '@/components/Modal/ModalDescription'
import { ModalFooter } from '@/components/Modal/ModalFooter'
import { ModalTitle } from '@/components/Modal/ModalTitle'
import { ModalBaseProps } from '@/types'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

type ConfirmationModalProps = ModalBaseProps & {
  btnText: string
  title: string
  description: string
  onConfirm: () => void
  loading: boolean
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  btnText = 'Confirm',
  title,
  description,
  loading = false,
}: ConfirmationModalProps): JSX.Element => {
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
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center lg:p-4">
              <Dialog.Panel className="rounded bg-white mx-auto max-w-lg w-full flex flex-col shadow-glow">
                <div className="w-full flex justify-between gap-x-4 px-8 pt-8">
                  <div className="flex gap-x-6">
                    {/* Icon */}
                    <div className="bg-red-10 text-red-90 h-14 w-14 rounded-full sm:place-content-center flex-shrink-0 hidden sm:grid">
                      <span className="w-7 h-7">
                        <AlertOctagon />
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <ModalTitle>{title}</ModalTitle>
                      <ModalDescription>{description}</ModalDescription>
                    </div>
                  </div>
                </div>

                <div className="w-full pb-8 px-8">
                  <ModalFooter>
                    <Button
                      variant="blank"
                      className="!text-gray-50 hover:text-gray-60"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button size="xs" type="submit" onClick={onConfirm} loading={loading} danger>
                      {btnText}
                    </Button>
                  </ModalFooter>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>

    // <Modal
    //   title={title}
    //   description={description}
    //   isOpen={isOpen}
    //   onClose={onClose}
    //   icon={<AlertOctagon />}
    // >
    //   <ModalFooter className="!mt-36">
    //     <Button variant="blank" onClick={onClose}>
    //       Cancel
    //     </Button>
    //     <Button size="xs" type="button" onClick={onConfirm} className="max-w-[161px] w-full" danger>
    //       {btnText}
    //     </Button>
    //   </ModalFooter>
    // </Modal>
  )
}
