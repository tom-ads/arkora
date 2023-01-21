import { RootState } from '@/stores/store'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { HorizontalDivider } from '../Divider'
import { ArkoraLogo } from '../Icons'
import { TabGroup, TabItem } from '../Navigation'

const NavItem = ({ to, children }: { to: string; children: ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          'font-medium text-sm px-3 py-1 rounded h-min min-w-[79px] grid place-content-center transition-colors outline-none',
          {
            'bg-white text-gray-100 hover:bg-gray-10 focus-visible:bg-gray-10': !isActive,
            'bg-purple-10 text-purple-90 hover': isActive,
          },
        )
      }
    >
      <span>{children}</span>
    </NavLink>
  )
}

export const Header = (): JSX.Element => {
  const location = useLocation()

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <header className="w-full bg-white">
      {/* Main Navi */}
      <div className="flex gap-x-6 max-w-[1440px] mx-auto py-4 px-7 lg:px-[46px]">
        <div className="flex items-center gap-2 pr-3">
          <ArkoraLogo className="w-[38px] h-[39px]" />
          <p className="text-2xl text-gray-100 font-istokWeb font-normal">Arkora</p>
        </div>

        {isAuthenticated && (
          <nav className="sm:flex gap-2 px-3 items-center hidden">
            <NavItem to="timer">Timer</NavItem>
            <NavItem to="projects">Projects</NavItem>
            <NavItem to="clients">Clients</NavItem>
            <NavItem to="team">Team</NavItem>
          </nav>
        )}
      </div>

      {isAuthenticated && (
        <>
          <HorizontalDivider />

          {/* Sub Navi */}
          <div className="h-[51px] flex gap-x-6 max-w-[1440px] mx-auto px-7 lg:px-[46px]">
            {location.pathname.includes('team') && (
              <TabGroup>
                <TabItem to="/team/members">Members</TabItem>
                <TabItem to="/team/timers">Timers</TabItem>
              </TabGroup>
            )}
          </div>
        </>
      )}
    </header>
  )
}
