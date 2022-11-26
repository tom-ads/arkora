import { CrossIcon } from '@/components/Icons'
import { MouseEventHandler, ReactNode } from 'react'

type SelectedProps = {
  onClick: MouseEventHandler<HTMLElement>
  children: ReactNode
}

export const Selected = ({ onClick, children }: SelectedProps) => {
  return (
    <div className="bg-purple-10 px-2 py-1 text-purple-90 font-medium text-[13px] rounded capitalize flex items-center gap-x-2 transition-all">
      {children}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div onClick={onClick} role="button" tabIndex={0}>
        <CrossIcon className="h-4 w-4" aria-hidden />
      </div>
    </div>
  )
}
