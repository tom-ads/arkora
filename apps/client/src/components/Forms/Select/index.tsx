import { ChevronIcon } from '@/components/Icons/ChevronIcon'
import { CircleTick } from '@/components/Icons/CircleTick'
import { Listbox, Transition } from '@headlessui/react'
import { cva } from 'class-variance-authority'
import classNames from 'classnames'
import { Fragment, useMemo, useState } from 'react'
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
  'relative border w-full rounded placeholder:text-gray-60 font-normal text-gray-80 transition-all outline-none flex items-center justify-between z-0 disabled:bg-gray-20',
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
    ],
    defaultVariants: {
      size: 'sm',
      error: false,
      focused: false,
      disabled: false,
    },
  },
)

const listBoxOptions = cva(
  'absolute bg-white w-full shadow-sm gap-y-1 rounded shadow-gray-40 overflow-y-auto flex flex-col outline-none scrollbar-hide z-50 p-3 min-h-[150px] max-h-[200px]',
  {
    variants: {
      fullWidth: {
        true: 'max-w-full',
        false: 'max-w-[350px] lg:max-w-[450px]',
      },
    },
  },
)

export const FormSelect = ({
  name,
  control,
  disabled,
  size = 'sm',
  placeHolder = 'Select option',
  error,
  fullWidth = false,
  children,
}: FormSelectProps): JSX.Element => {
  const [focused, setFocused] = useState(false)

  const {
    field: { value, onChange },
  } = useController({ name, control })

  const validChildren = useMemo(
    () =>
      children
        ?.filter((v) => v.props?.id)
        .map((child) => ({
          id: child?.props?.id,
          children: child?.props?.children,
        })),
    [children],
  )

  const selectedItem = validChildren?.find((item) => item.id === value)

  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            <Listbox.Button className={listBoxButton({ size, error, focused })}>
              <span
                className={classNames('text-gray-60 text-start truncate capitalize', {
                  'text-gray-90': selectedItem?.children,
                })}
              >
                {/* Child of SelectOption, a.k.a the display prop */}
                {selectedItem?.children ?? placeHolder}
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
                {validChildren.map((child) => (
                  <Listbox.Option
                    key={child.id}
                    value={child?.id}
                    className={({ selected }) =>
                      classNames(
                        'text-gray-80 cursor-pointer outline-none w-full flex items-center justify-between rounded hover:bg-gray-10 text-sm lg:text-base p-2 lg:p-3',
                        {
                          'bg-purple-10 !text-purple-90 hover:bg-purple-10': selected,
                        },
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="truncate capitalize select-none pointer-events-none">
                          {child?.children}
                        </span>
                        {selected && (
                          <span className="w-4 h-4 shrink-0 mr-1" aria-hidden>
                            <CircleTick aria-hidden />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  )
}
