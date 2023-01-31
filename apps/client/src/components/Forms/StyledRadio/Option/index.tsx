import { TickIcon } from '@/components/Icons'
import { RadioGroup } from '@headlessui/react'
import { cva } from 'class-variance-authority'

const radioItemStyling = cva(
  'relative border w-full rounded transition-all outline-none appearance-none text-left p-[10px] cursor-pointer',
  {
    variants: {
      checked: {
        true: 'border-purple-90 shadow-sm shadow-purple-70 bg-purple-10 focus:bg-purple-10',
        false: 'border-gray-40',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
)

type StyledRadioOptionProps = {
  title: string
  description?: string
  icon?: JSX.Element
  value: string | number | boolean
}

export const FormStyledRadioOption = ({
  title,
  description,
  icon,
  value,
}: StyledRadioOptionProps) => {
  return (
    <RadioGroup.Option value={value} className={({ checked }) => radioItemStyling({ checked })}>
      {({ checked }) => (
        <>
          <div className="flex gap-[6px] items-center">
            {icon && (
              <div className="w-4 h-4 text-purple-90" aria-hidden>
                {icon}
              </div>
            )}
            <p
              className={`text-[13px] font-medium ${checked ? 'text-purple-90' : 'text-gray-100'}`}
            >
              {title}
            </p>
          </div>

          <p className="text-xs text-gray-80">{description}</p>

          {checked && (
            <div className="absolute right-0 top-0 w-4 h-4 translate-x-[6px] -translate-y-[6px] bg-white rounded-full p-[1px]">
              <div className="w-[14px] h-[14px] bg-purple-90 rounded-full grid place-content-center">
                <TickIcon className="w-3 h-3 text-white stroke-[2px]" />
              </div>
            </div>
          )}
        </>
      )}
    </RadioGroup.Option>
  )
}
