import { Button } from '@/components/Button'
import { ChevronIcon } from '@/components/Icons/ChevronIcon'
import { CircleTick } from '@/components/Icons/CircleTick'
import { Listbox, Transition } from '@headlessui/react'
import { cva } from 'class-variance-authority'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Selected } from './selected/mix'

type FormMultiselectProps = {
  name: string
  control: any
  size?: 'xs' | 'sm' | 'md' | 'lg'
  placeHolder?: string
  error?: boolean
  fullWidth?: boolean
  children: JSX.Element[]
}

type SelectedItem = {
  id: string | number
  value: string
}

const multiSelectButton = cva(
  'relative border w-full rounded placeholder:text-gray-60 font-normal text-gray-80 transition-all outline-none flex items-center justify-between z-0 min-w-[150px] lg:min-w-[200px]',
  {
    variants: {
      size: {
        xs: 'px-3 py-[7px] text-sm focus:shadow-sm',
        sm: 'px-3 py-[9px] text-base focus:shadow-sm',
        md: 'px-3 py-[10px] text-lg focus:shadow-md',
        lg: 'px-[14px] py-[11px] text-xl focus:shadow-lg',
      },
      error: {
        true: 'border-red-90 focus:shadow-md focus:shadow-red-90',
        false: 'focus:shadow-purple-70 focus:border-purple-90',
      },
      focused: {
        true: 'border-purple-90 shadow-purple-70 shadow-sm',
        false: 'focus:shadow-purple-70 focus:border-purple-90 border-gray-40',
      },
    },
    compoundVariants: [
      {
        error: true,
        focused: true,
        className: '!shadow-red-90 !border-red-90',
      },
    ],
    defaultVariants: {
      size: 'sm',
    },
  },
)

const multiSelectOptions = cva(
  'absolute bg-white w-full shadow-sm gap-y-1 rounded shadow-gray-40 overflow-y-auto flex flex-col outline-none scrollbar-hide z-50 px-3 py-4 lg:p-4 min-h-[150px]',
  {
    variants: {
      fullWidth: {
        true: 'max-w-full',
        false: 'max-w-[350px] lg:max-w-[450px]',
      },
    },
  },
)

export const FormMultiSelect = ({
  name,
  control,
  size = 'sm',
  placeHolder = 'Select options',
  error,
  fullWidth = false,
  children,
}: FormMultiselectProps): JSX.Element => {
  const [focused, setFocused] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const validChildren = children
          ?.filter((v) => v.props)
          ?.map((child) => ({
            id: child?.props?.id,
            value: child?.props?.value,
            children: child?.props?.children,
          }))

        const handleRemove = (selected: SelectedItem) => {
          field.onChange(field.value?.filter((child: SelectedItem) => child?.id !== selected.id))
        }

        const handleSelectAll = () => {
          if (field.value?.length !== validChildren?.length) {
            field.onChange(validChildren?.map((child) => child?.id))
          }
        }

        const onChange = (data: SelectedItem) => {
          // Filter out existing child
          if (field.value?.some((child: SelectedItem) => child?.id === data.id)) {
            field.onChange(field.value?.filter((child: SelectedItem) => child?.id !== data.id))
            return
          }

          // Add item to existing list of children
          field.onChange([...field.value, data])
        }

        return (
          <div className="relative w-full">
            <Listbox value={field.value} multiple>
              {({ open }) => (
                <>
                  <Listbox.Button className={multiSelectButton({ size, focused, error })}>
                    {/* Selected Items */}
                    {field?.value?.length > 0 ? (
                      <div className="flex-grow flex flex-wrap gap-2">
                        {field.value?.map((fieldItem: SelectedItem) => (
                          <Selected
                            key={fieldItem?.id}
                            size={size}
                            onClick={(e) => {
                              // Prevent this event from bubbling up into the ListBox.Button component
                              e.stopPropagation()
                              handleRemove(fieldItem)
                            }}
                          >
                            {fieldItem?.value}
                          </Selected>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-60 text-start">{placeHolder}</span>
                    )}
                    <span
                      aria-hidden
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
                          '-rotate-180': focused,
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
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      className={multiSelectOptions({ fullWidth })}
                      static
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-base font-medium leading-4 text-gray-100">
                          Team Members -{' '}
                          <span className="font-semibold text-sm">
                            {field.value?.length ?? '00'}
                          </span>{' '}
                          <span className="font-normal text-sm">Selected</span>
                        </p>

                        <div className="text-sm text-gray-100 space-x-1">
                          <Button variant="blank" onClick={handleSelectAll}>
                            Select All
                          </Button>
                        </div>
                      </div>
                      <ul className="w-full outline-none overflow-y-auto scrollbar-hide min-h-[150px] max-h-[200px] space-y-1 lg:space-y-2">
                        {validChildren?.map((child) => (
                          <Listbox.Option
                            onClick={() => onChange(child)}
                            key={child?.id}
                            value={child?.value}
                            className={classNames(
                              'text-gray-80 cursor-pointer outline-none w-full flex items-center justify-between rounded hover:bg-gray-10 relative pr-10',
                              {
                                'text-sm px-3 py-[6px]':
                                  size === 'xs' || size === 'sm' || size === 'md',
                                'text-base px-3 py-2': size === 'lg',

                                'bg-purple-10 !text-purple-90 hover:bg-purple-10':
                                  field.value?.some((item: SelectedItem) => item?.id === child?.id),
                              },
                            )}
                          >
                            <>
                              {child?.children}
                              {field.value?.some(
                                (item: SelectedItem) => item?.id === child?.id,
                              ) && (
                                <span
                                  aria-hidden
                                  className="absolute inset-y-0 right-[12px] flex items-center"
                                >
                                  <CircleTick className="w-4 h-4 shrink-0" />
                                </span>
                              )}
                            </>
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
