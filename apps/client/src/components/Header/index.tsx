import { RootState } from '@/stores/store'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../Button'
import { HorizontalDivider } from '../Divider'
import { ArkoraLogo } from '../Icons'
import { TabGroup, TabNavItem } from '../Navigation'

const NavItem = ({ to, children }: { to: string; children: ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          'font-medium text-sm px-3 py-1 rounded h-min min-w-[79px] grid place-content-center transition-colors outline-none',
          {
            'bg-white text-gray-80 hover:bg-gray-10 focus-visible:bg-gray-10': !isActive,
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
  const navigate = useNavigate()

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  return (
    <header className="w-full bg-white">
      {/* Main Navi */}
      <div className="flex gap-x-6 max-w-[1440px] mx-auto py-4 px-7 lg:px-[46px]">
        <div className="flex items-center gap-2 pr-3">
          <Button onClick={() => navigate(isAuthenticated ? '/timer' : '/')} variant="blank">
            <ArkoraLogo className="w-[38px] h-[39px]" />
            <p className="text-2xl text-gray-100 font-istokWeb font-normal">Arkora</p>
          </Button>
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
              <TabGroup className="gap-x-9">
                <TabNavItem to="/team/members">Members</TabNavItem>
                <TabNavItem to="/team/timers">Timers</TabNavItem>
              </TabGroup>
            )}
          </div>
        </>
      )}
    </header>
  )
}
