import { ArrowThin } from '@/components/Icons'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type PageBackBtnProps = {
  to: string
  children: ReactNode
}

export const PageBackBtn = ({ to, children }: PageBackBtnProps): JSX.Element => {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 text-white hover:text-gray-10 hover:underline focus:underline w-min whitespace-nowrap mb-3 outline-none"
    >
      <ArrowThin className="w-6 h-6 shrink-0" />
      {children}
    </Link>
  )
}
