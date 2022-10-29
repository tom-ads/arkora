import { ChevronIcon } from '@/components/Icons/ChevronIcon'
import { CircleTick } from '@/components/Icons/CircleTick'
import { Listbox, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Controller } from 'react-hook-form'

type FormSelectProps = {
  name: string
  control: any
  size?: 'sm' | 'md' | 'lg'
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
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const validChildren = children.filter((v) => v.props?.value)

        // const handleChange = (value: string) => {}

        return (
          <div className="relative w-full">
            <Listbox value={field.value} onChange={field.onChange}>
              {({ open }) => (
                <>
                  <Listbox.Button
                    className={classNames(
                      'border border-gray-40 w-full rounded placeholder:text-green-60 font-normal text-gray-80 transition-all outline-none flex items-center justify-between group',
                      {
                        'px-3 py-2 text-sm focus:shadow-sm': size === 'sm',
                        'px-3 py-3 text-base focus:shadow-md': size === 'md',
                        'px-[0.875rem] py-[10px] text-xl focus:shadow-lg': size === 'lg',

                        'focus:shadow-purple-70 focus:border-purple-90': !error,
                        'border-red-90 focus:shadow-md focus:shadow-red-90': error,
                      },
                    )}
                  >
                    <span
                      className={classNames('text-gray-80 text-start truncate', {
                        'text-gray-100': field.value,
                      })}
                    >
                      {field.value ?? placeHolder}
                    </span>
                    <span
                      className={classNames(
                        'text-gray-100 ml-2 flex flex-shrink-0 pointer-events-none',
                        {
                          'w-5 h-5': size === 'sm' || size === 'md',
                          'w-6 h-6': size === 'lg',
                        },
                      )}
                    >
                      <ChevronIcon
                        className="transform transition-transform group-active:-rotate-180"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    enter="transition duration-200 ease-out"
                    enterFrom="transform translate-y-0 opacity-0"
                    enterTo="transform translate-y-1 opacity-100"
                    leave="transition duration-150 ease-in"
                    leaveFrom="transform translate-y-1 opacity-100"
                    leaveTo="transform translate-y-0 opacity-0"
                  >
                    <Listbox.Options
                      className={classNames(
                        'absolute bg-white w-full shadow-sm rounded shadow-gray-40 overflow-y-auto flex flex-col  outline-none',
                        {
                          'min-w-[200px] max-w-[270px] max-h-44 p-3 gap-y-1':
                            size === 'sm' || size === 'md',
                          'min-w-[270px] max-w-[330px] max-h-44 py-4 px-3 gap-y-2': size === 'lg',
                        },
                      )}
                      static
                    >
                      {validChildren.map((child) => (
                        <Listbox.Option
                          value={child.props.value}
                          key={child.key}
                          className={({ selected }) =>
                            classNames(
                              'text-gray-80 cursor-pointer outline-none w-full flex items-center justify-between rounded hover:bg-gray-10',
                              {
                                'text-sm px-2 py-[6px]': size === 'sm' || size === 'md',
                                'text-base px-3 py-2': size === 'lg',

                                'bg-purple-10 !text-purple-90 hover:bg-purple-10': selected,
                              },
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span className="truncate block">{child}</span>
                              {selected && (
                                <span className="w-4 h-4 shrink-0 mr-1">
                                  <CircleTick />
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
