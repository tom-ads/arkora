import { RootState } from '@/stores/store'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Divider } from '../Divider'
import { ArkoraLogo } from '../Icons'

const NavItem = ({ to, children }: { to: string; children: ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          'font-medium text-sm px-3 py-1 rounded h-min min-w-[79px] grid place-content-center transition-colors',
          {
            'bg-white text-gray-100 hover:bg-gray-10': !isActive,
            'bg-purple-10 text-purple-90': isActive,
          },
        )
      }
    >
      <span>{children}</span>
    </NavLink>
  )
}

export const Header = (): JSX.Element => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <header className="w-full bg-white">
      {/* Main Navi */}
      <div className="flex gap-x-6 max-w-[1440px] mx-auto py-4 px-[46px]">
        <div className="flex items-center gap-2 pr-3">
          <ArkoraLogo className="w-[38px] h-[39px]" />
          <p className="text-2xl text-gray-100 font-istokWeb font-normal">Arkora</p>
        </div>

        {isAuthenticated && (
          <nav className="flex gap-2 px-3 items-center">
            <NavItem to="projects">Projects</NavItem>
            <NavItem to="team">Team</NavItem>
          </nav>
        )}
      </div>

      {isAuthenticated && (
        <>
          <Divider />

          {/* Sub Navi */}
          <div className="h-[51px] flex gap-x-6 max-w-[1440px] mx-auto px-[46px]"></div>
        </>
      )}
    </header>
  )
}
