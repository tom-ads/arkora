import { CrossIcon } from '@/components/Icons'
import { cva, VariantProps } from 'class-variance-authority'
import { MouseEventHandler, ReactNode } from 'react'

const selected = cva(
  'bg-purple-10 text-purple-90 font-medium rounded capitalize flex items-center transition-all',
  {
    variants: {
      size: {
        xs: 'px-2 text-2xs gap-x-2',
        sm: 'px-2 text-xs gap-x-2 h-[22px]',
        md: 'px-3 text-sm gap-x-3',
        lg: 'px-3 py-[3px] text-base gap-x-3',
      },
    },
  },
)

type SelectedProps = VariantProps<typeof selected> & {
  onClick: MouseEventHandler<HTMLElement>
  children: ReactNode
}

export const Selected = ({ size, onClick, children }: SelectedProps) => {
  return (
    <div className={selected({ size })}>
      {children}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div onClick={onClick} role="button" tabIndex={0}>
        <CrossIcon className="h-4 w-4" aria-hidden />
      </div>
    </div>
  )
}
