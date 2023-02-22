import classNames from 'classnames'
import { ReactNode } from 'react'

type AvatarProps = {
  className?: string
  children: ReactNode
}

export const Avatar = ({ className, children }: AvatarProps): JSX.Element => {
  return (
    <div
      className={classNames(
        'rounded-full bg-purple-10 w-8 h-8 grid place-content-center shrink-0',
        className,
      )}
    >
      <span className="text-[13px] font-medium text-purple-90">{children}</span>
    </div>
  )
}
