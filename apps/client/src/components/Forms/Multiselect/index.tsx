import { CrossIcon } from '@/components/Icons'
import { ChevronIcon } from '@/components/Icons/ChevronIcon'
import { CircleTick } from '@/components/Icons/CircleTick'
import { Listbox, Transition } from '@headlessui/react'
import { cva } from 'class-variance-authority'
import classNames from 'classnames'
import { Fragment, useMemo, useState } from 'react'
import { useController } from 'react-hook-form'
import { FormSelectBaseProps, selectBtnStyling, selectOptionStyling } from '../Select'

const selectedStyling = cva(
  'bg-purple-10 text-purple-90 font-medium rounded capitalize flex items-center transition-all',
  {
    variants: {
      size: {
        xs: 'px-2 text-2xs gap-x-2',
        sm: 'px-2 text-sm gap-x-2 h-[22px]',
        md: 'px-3 text-sm gap-x-3',
        lg: 'px-3 py-[3px] text-base gap-x-3',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

interface FormMultiSelectProps extends FormSelectBaseProps {
  holderTxt?: string
}

export const FormMultiSelect = ({
  name,
  control,
  size,
  error,
  disabled,
  fullWidth = false,
  holderTxt,
  placeHolder = 'Select options',
  children,
}: FormMultiSelectProps): JSX.Element => {
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

  const handleOnChange = (selectedItems: any[]) => {
    if (value?.some((child: any[]) => child === selectedItems)) {
      selectedItems = value?.filter((item: any) => item !== selectedItems)
    }

    onChange(selectedItems)
  }

  const handleRemove = () => {
    onChange([])
  }

  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={handleOnChange} disabled={disabled} multiple>
        {({ open }) => (
          <>
            <Listbox.Button className={selectBtnStyling({ size, error, focused })}>
              <span
                className={classNames('text-gray-60 text-start truncate capitalize', {
                  'text-gray-90': value?.length > 0,
                })}
              >
                {value?.length ? (
                  <div className={selectedStyling({ size })}>
                    <span>
                      {value?.length} {holderTxt ?? 'Selected'}
                    </span>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove()
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <CrossIcon className="h-4 w-4" aria-hidden />
                    </div>
                  </div>
                ) : (
                  placeHolder
                )}
              </span>
              <span
                aria-hidden
                className={classNames('text-gray-100 ml-2 flex flex-shrink-0 pointer-events-none', {
                  'w-5 h-5': size === 'xs' || size === 'sm' || size === 'md',
                  'w-6 h-6': size === 'lg',
                })}
              >
                <ChevronIcon
                  className={classNames('transform transition-transform w-5', {
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
                className={selectOptionStyling({ fullWidth })}
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
