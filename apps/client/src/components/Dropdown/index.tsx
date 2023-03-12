import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, ReactNode } from 'react'

type DropdownItemProps = {
  onClick?: () => void
  className?: string
  children: ReactNode
}

export const DropdownItem = ({ onClick, className, children }: DropdownItemProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={classNames(
            'px-2 py-1 w-full text-left rounded-[4px] hover:bg-gray-10 hover:text-gray-80 focus:bg-purple-10 focus:text-purple-90 flex items-center text-sm',
            {
              'bg-purple-10 text-purple-90': active,
              'text-gray-80': !active,
            },
            className,
          )}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  )
}

type DropdownProps = {
  trigger: JSX.Element
  children: ReactNode
}

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="w-full">{trigger}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-52 p-2 origin-top-right rounded-[4px] space-y-1 bg-white shadow-glow focus:outline-none z-10">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
