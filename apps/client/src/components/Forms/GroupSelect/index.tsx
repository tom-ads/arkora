import { ChevronIcon } from '@/components/Icons/ChevronIcon'
import { Listbox, Transition } from '@headlessui/react'
import { cva } from 'class-variance-authority'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Fragment, useState } from 'react'
import { useController } from 'react-hook-form'

type FormSelectProps = {
  name: string
  control: any
  size?: 'xs' | 'sm' | 'md' | 'lg'
  placeHolder?: string
  error?: boolean
  disabled?: boolean
  fullWidth?: boolean
  children: JSX.Element[]
}

const listBoxButton = cva(
  'relative border w-full rounded placeholder:text-gray-60 font-normal text-gray-80 transition-all outline-none flex items-center justify-between z-0',
  {
    variants: {
      size: {
        xs: 'px-3 py-[7px] text-sm focus:shadow-sm',
        sm: 'px-3 py-[9px] text-base focus:shadow-sm',
        md: 'px-3 py-[10px] text-lg focus:shadow-md',
        lg: 'px-[14px] py-[11px] text-xl focus:shadow-lg',
      },
      error: {
        true: '!border-red-90 focus:shadow-md focus:!shadow-red-90',
        false: 'focus:shadow-purple-70 focus:border-purple-90',
      },
      focused: {
        true: 'border-purple-90 shadow-purple-70 shadow-sm',
        false: 'focus:shadow-purple-70 focus:border-purple-90 border-gray-40',
      },
      disabled: { true: '', false: '' },
    },
    compoundVariants: [
      {
        error: true,
        focused: true,
        className: '!shadow-red-90',
      },
      {
        disabled: true,
        className: 'bg-gray-20 text-gray-40 border-gray-40 shadow-none focus:shadow-none',
      },
    ],
    defaultVariants: {
      size: 'sm',
      disabled: false,
      focused: false,
      error: false,
    },
  },
)

const listBoxOptions = cva(
  'absolute bg-white w-full shadow-sm gap-y-1 rounded shadow-gray-40 overflow-y-auto flex flex-col outline-none scrollbar-hide z-50 p-3 lg:p-4 min-h-[150px] max-h-[200px]',
  {
    variants: {
      fullWidth: {
        true: 'max-w-full',
        false: 'max-w-[350px] lg:max-w-[450px]',
      },
    },
  },
)

export const FormGroupSelect = ({
  name,
  control,
  size = 'sm',
  placeHolder = 'Select option',
  error,
  disabled,
  fullWidth = false,
  children,
}: FormSelectProps): JSX.Element => {
  const { field } = useController({ name, control })

  const [focused, setFocused] = useState(false)

  const validChildren = useMemo(() => {
    return children
      .map((child) => child.props?.group)
      .flat()
      .map((child) => ({
        id: child.id,
        value: child.value,
        display: child.display,
      }))
  }, [children])

  const handleChange = (selectedItem: number) => {
    field.onChange(validChildren?.find((child) => child.id === selectedItem))
  }

  return (
    <div className="relative w-full">
      {/* Listbox will not change last selected if passed undefined, so we need to pass null instead */}
      <Listbox value={field.value?.id ?? null} onChange={handleChange} disabled={disabled}>
        {({ open }) => (
          <>
            <Listbox.Button className={listBoxButton({ size, error, focused, disabled })}>
              <span
                className={classNames('text-gray-60 text-start truncate capitalize', {
                  'text-gray-90': field.value?.display,
                })}
              >
                {/* Child of SelectOption, a.k.a the display prop */}
                {field.value?.display ?? placeHolder}
              </span>
              <span
                aria-hidden
                className={classNames('text-gray-100 ml-2 flex flex-shrink-0 pointer-events-none', {
                  'w-5 h-5': size === 'xs' || size === 'sm' || size === 'md',
                  'w-6 h-6': size === 'lg',
                })}
              >
                <ChevronIcon
                  className={classNames('transform transition-transform', {
                    '-rotate-180': focused,
                    'text-gray-60': disabled,
                  })}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              show={open}
              enter="transition duration-200 ease-out"
              enterFrom="transform translate-y-0 opacity-0"
              enterTo="transform translate-y-1 opacity-100"
              leave="transition duration-150 ease-in"
              leaveFrom="transform translate-y-1 opacity-100"
              leaveTo="transform translate-y-0 opacity-0"
            >
              <Listbox.Options
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={listBoxOptions({ fullWidth })}
                static
              >
                {children}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  )
}
