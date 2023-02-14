import { ColourRing } from '@/components/Ring'
import { generateColours } from '@/helpers/colours'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useEffect, useMemo } from 'react'
import { TwitterPicker } from 'react-color'
import { useController } from 'react-hook-form'

type ColourPickerProps = {
  name: string
  control: any
}

export const ColourPicker = ({ name, control }: ColourPickerProps): JSX.Element => {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  const colours = useMemo(
    () =>
      generateColours(14, {
        contrastAgainst: '#FFFFFF',
        excludedHueRanges: [
          // Reds
          { min: 0, max: 10 },
          { min: 345, max: 355 },
          // Greens
          { min: 100, max: 123 },
          // Yellows
          { min: 33, max: 43 },
        ],
      }),
    [],
  )

  useEffect(() => {
    if (!value && colours?.length) {
      onChange(colours[0])
    }
  }, [value, colours])

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <div className="flex gap-3">
            <ColourRing colour={value} size="lg" />
            <Popover.Button className="outline-none focus-visible:text-purple-70">
              <p className="text-purple-90 font-semibold text-sm">Change</p>
            </Popover.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition-opacity duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel className="absolute z-10" static>
              <TwitterPicker
                color={value}
                colors={colours}
                onChangeComplete={({ hex }) => onChange(hex)}
                triangle="top-right"
                styles={{
                  default: {
                    card: {
                      top: 5,
                      right: 185,
                    },
                  },
                }}
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
