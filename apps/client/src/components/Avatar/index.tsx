import { cva } from 'class-variance-authority'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const avatarStyling = cva('rounded-full bg-purple-10 w-8 h-8 grid place-content-center shrink-0', {
  variants: {
    isLoading: {
      true: 'animate-pulse',
    },
  },
  defaultVariants: {
    isLoading: false,
  },
})

type AvatarProps = {
  className?: string
  isLoading?: boolean
  children: ReactNode
}

export const Avatar = ({ className, isLoading, children }: AvatarProps): JSX.Element => {
  const styling = twMerge(avatarStyling({ isLoading }), className)

  if (isLoading) {
    return <div className={styling}></div>
  }

  return (
    <div className={styling}>
      <span className="text-[13px] font-medium text-purple-90">{children}</span>
    </div>
  )
}
