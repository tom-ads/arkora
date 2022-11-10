import { ChevronIcon } from '@/components/Icons/ChevronIcon'
import { CircleTick } from '@/components/Icons/CircleTick'
import { Listbox, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { Controller } from 'react-hook-form'

type FormSelectProps = {
  name: string
  control: any
  size?: 'xs' | 'sm' | 'md' | 'lg'
  placeHolder?: string
  error?: boolean
  children: JSX.Element[]
}

export const FormSelect = ({
  name,
  control,
  size = 'sm',
  placeHolder = 'Select option',
  error,
  children,
}: FormSelectProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const validChildren = children.filter((v) => v.props?.value)

        const handleChange = (selectedItem: string) => {
          field.onChange(validChildren.find((v) => v.props.value === selectedItem)?.props)
        }

        return (
          <div className="relative w-full">
            <Listbox value={field.value?.value} onChange={handleChange}>
              {({ open }) => (
                <>
                  <Listbox.Button
                    className={classNames(
                      'relative border border-gray-40 w-full rounded placeholder:text-green-60 font-normal text-gray-80 transition-all outline-none flex items-center justify-between z-0',
                      {
                        'px-2 py-1': size === 'xs',
                        'px-3 py-2 text-sm focus:shadow-sm': size === 'sm',
                        'px-3 py-3 text-base focus:shadow-md': size === 'md',
                        'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',

                        'focus:shadow-purple-70 focus:border-purple-90': !error,
                        'border-red-90 focus:shadow-md focus:shadow-red-90': error,
                        '!border-purple-90 !shadow-purple-70 shadow-sm': isFocused,
                      },
                    )}
                  >
                    <span
                      className={classNames('text-gray-80 text-start truncate capitalize', {
                        'text-gray-100': field.value,
                      })}
                    >
                      {/* Child of SelectOption, a.k.a the display prop */}
                      {field.value?.children ?? placeHolder}
                    </span>
                    <span
                      className={classNames(
                        'text-gray-100 ml-2 flex flex-shrink-0 pointer-events-none',
                        {
                          'w-5 h-5': size === 'xs' || size === 'sm' || size === 'md',
                          'w-6 h-6': size === 'lg',
                        },
                      )}
                    >
                      <ChevronIcon
                        className={classNames('transform transition-transform', {
                          '-rotate-180': isFocused,
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
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className={classNames(
                        'absolute bg-white w-full shadow-sm rounded shadow-gray-40 overflow-y-auto flex flex-col outline-none scrollbar-hide z-50',
                        {
                          'min-w-[200px] max-w-[270px] max-h-40 gap-y-1 p-[7px]': size === 'xs',
                          'min-w-[200px] max-w-[270px] max-h-40 gap-y-1 p-2':
                            size === 'sm' || size === 'md',
                          'min-w-[270px] max-w-[330px] max-h-44 py-4 px-3 gap-y-2': size === 'lg',
                        },
                      )}
                      static
                    >
                      {validChildren.map((child) => (
                        <Listbox.Option
                          key={child.key}
                          value={child.props?.value}
                          className={({ selected }) =>
                            classNames(
                              'text-gray-80 cursor-pointer outline-none w-full flex items-center justify-between rounded hover:bg-gray-10',
                              {
                                'text-sm px-2 py-[6px]':
                                  size === 'xs' || size === 'sm' || size === 'md',
                                'text-base px-3 py-2': size === 'lg',

                                'bg-purple-10 !text-purple-90 hover:bg-purple-10': selected,
                              },
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className="truncate capitalize select-none pointer-events-none">
                                {child}
                              </span>
                              {selected && (
                                <span className="w-4 h-4 shrink-0 mr-1">
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
      }}
    />
  )
}
