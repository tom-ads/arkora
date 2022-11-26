import { ChevronIcon } from '@/components/Icons/ChevronIcon'
import { CircleTick } from '@/components/Icons/CircleTick'
import { Listbox, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Selected } from './selected'

type FormMultiselectProps = {
  name: string
  control: any
  size?: 'xs' | 'sm' | 'md' | 'lg'
  placeHolder?: string
  error?: boolean
  fullWidth?: boolean
  children: JSX.Element[]
}

export const FormMultiselect = ({
  name,
  control,
  size = 'sm',
  placeHolder = 'Select options',
  error,
  fullWidth = false,
  children,
}: FormMultiselectProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const validChildren = children?.filter((v) => v.props?.value)

        const handleRemove = (selected: string) => {
          field.onChange(field.value.filter((value: string) => value !== selected))
        }

        return (
          <div className="relative w-full">
            <Listbox value={field.value} onChange={field.onChange} multiple>
              {({ open }) => (
                <>
                  <Listbox.Button
                    className={classNames(
                      'relative border border-gray-40 w-full rounded placeholder:text-gray-60 font-normal text-gray-80 transition-all outline-none flex items-center justify-between z-0',
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
                    {/* Selected Items */}
                    {field?.value?.length > 0 ? (
                      <div className="flex-grow flex flex-wrap gap-2">
                        {field.value?.map((fieldItem: string) => (
                          <Selected
                            key={fieldItem}
                            onClick={(e) => {
                              // Prevent this event from bubbling up into the ListBox.Button component
                              e.stopPropagation()
                              handleRemove(fieldItem)
                            }}
                          >
                            {fieldItem}
                          </Selected>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-60 text-start">{placeHolder}</span>
                    )}
                    <span
                      aria-hidden="true"
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
                      as="div"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className={classNames(
                        'absolute bg-white w-full shadow-sm rounded shadow-gray-40 flex flex-col z-50 outline-none',
                        {
                          'gap-y-1 p-[7px]': size === 'xs',
                          'gap-y-2 p-4': size == 'sm' || size === 'md',
                          'py-4 px-3 gap-y-2': size === 'lg',

                          'min-w-[200px] max-w-[270px]':
                            (size === 'xs' || size === 'sm' || size === 'md') && !fullWidth,
                          'min-w-[270px] max-w-[330px]': size === 'lg' && !fullWidth,
                          'max-w-full': fullWidth,
                        },
                      )}
                      static
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="text-base font-medium leading-4 text-gray-100">
                          Team Members
                        </h3>
                        <div className="text-sm text-gray-100 space-x-1">
                          <span className="font-semibold">{field.value?.length ?? '00'}</span>
                          <span>Selected</span>
                        </div>
                      </div>
                      <ul
                        className={classNames(
                          'w-full flex flex-col outline-none overflow-y-auto scrollbar-hide',
                          {
                            'gap-y-1 max-h-44 min-h-[150px]': size === 'xs',
                            'gap-y-2 max-h-44 min-h-[100px]':
                              size === 'sm' || size === 'md' || size === 'lg',
                          },
                        )}
                      >
                        {validChildren?.map((child) => (
                          <Listbox.Option
                            key={child.key}
                            value={child.props?.value}
                            className={({ selected }) =>
                              classNames(
                                'text-gray-80 cursor-pointer outline-none w-full flex items-center justify-between rounded hover:bg-gray-10 relative pr-10',
                                {
                                  'text-sm px-3 py-[6px]':
                                    size === 'xs' || size === 'sm' || size === 'md',
                                  'text-base px-3 py-2': size === 'lg',

                                  'bg-purple-10 !text-purple-90 hover:bg-purple-10': selected,
                                },
                              )
                            }
                          >
                            {({ selected }) => (
                              <>
                                {child}
                                {selected && (
                                  <span
                                    className="absolute inset-y-0 right-[12px] flex items-center"
                                    aria-hidden
                                  >
                                    <CircleTick className="w-4 h-4 shrink-0" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </ul>
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
