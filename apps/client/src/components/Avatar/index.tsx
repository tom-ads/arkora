import { ReactNode } from 'react'

type AvatarProps = {
  children: ReactNode
}

export const Avatar = ({ children }: AvatarProps): JSX.Element => {
  return (
    <div className="rounded-full bg-purple-10 w-8 h-8 grid place-content-center shrink-0">
      <span className="text-[13px] font-medium text-purple-90">{children}</span>
    </div>
  )
}
