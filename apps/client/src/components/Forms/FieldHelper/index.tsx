import { InfoCircleIcon } from '@/components/Icons'
import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, ReactNode, useState } from 'react'

type FormFieldHelperProps = {
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const ToolTip = ({ show, children }: { show: boolean; children: ReactNode }) => {
  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div className="bg-white w-10 h-10 absolute shadow-lg shadow-gray-50 p-2 rounded">
        {children}
      </div>
    </Transition>
  )
}

const FormFieldHelper = ({ size = 'md', children }: FormFieldHelperProps): JSX.Element => {
  const [show, setShow] = useState(false)

  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className={classNames('text-gray-80 relative flex flex-shrink-0 cursor-pointer', {
        'w-4 h-4': size === 'sm',
        'w-[18px] h-[18px]': size === 'md',
        'w-5 h-5': size === 'lg',
      })}
    >
      <InfoCircleIcon />

      <ToolTip show={show}>{children}</ToolTip>
    </div>
  )
}

export default FormFieldHelper
