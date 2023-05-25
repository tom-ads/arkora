import { useLogoutMutation } from '@/features/auth'
import { RootState } from '@/stores/store'
import classNames from 'classnames'
import { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { HorizontalDivider } from '../Divider'
import { Dropdown, DropdownItem } from '../Dropdown'
import { ArkoraLogo, ArrowThin } from '../Icons'
import { TabGroup, TabNavItem } from '../Navigation'
import { clearAuth } from '@/stores/slices/auth'
import { ProfileModal } from '@/features/account'
import { ManageOrganisationModal } from '@/features/organisation'
import UserRole from '@/enums/UserRole'

const AvatarDropdown = () => {
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false)
  const [openOrganisationModal, setOpenOrganisationModal] = useState<boolean>(false)

  const dispatch = useDispatch()

  const { authInitials } = useSelector((state: RootState) => ({
    authInitials: state.auth.user?.initials,
  }))

  const [triggerLogout, { isSuccess }] = useLogoutMutation()

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearAuth())
    }
  }, [isSuccess])

  return (
    <div className="relative">
      <Dropdown
        trigger={
          <Avatar className="w-10 h-10">
            <span className="text-sm font-semibold uppercase">{authInitials}</span>
          </Avatar>
        }
      >
        <DropdownItem className="h-8" onClick={() => setOpenProfileModal(true)}>
          Account
        </DropdownItem>
        <DropdownItem className="h-8" onClick={() => setOpenOrganisationModal(true)}>
          Organisation
        </DropdownItem>

        <HorizontalDivider className="mt-3 mb-[2px]" />

        <DropdownItem
          onClick={triggerLogout}
          className="rounded-none flex items-center justify-between"
        >
          <span>Logout</span>
          <ArrowThin className="transform rotate-180 w-6 h-6 text-purple-90" />
        </DropdownItem>
      </Dropdown>

      <ProfileModal isOpen={openProfileModal} onClose={() => setOpenProfileModal(false)} />
      <ManageOrganisationModal
        isOpen={openOrganisationModal}
        onClose={() => setOpenOrganisationModal(false)}
      />
    </div>
  )
}

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

  const { isAuthenticated, authRole } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    authRole: state.auth.user?.role?.name,
  }))

  return (
    <header className="w-full bg-white">
      {/* Main Navi */}
      <div className="flex items-center justify-between max-w-[1440px] mx-auto py-4 px-7 lg:px-[46px]">
        <div className="flex items-center gap-x-6">
          <div className="pr-3">
            <Button onClick={() => navigate(isAuthenticated ? '/timer' : '/')} variant="blank">
              <ArkoraLogo className="w-[38px] h-[39px]" />
              <p className="text-2xl text-gray-100 font-istokWeb font-normal">Arkora</p>
            </Button>
          </div>
          {isAuthenticated && (
            <nav className="sm:flex gap-2 px-3 items-center hidden">
              <NavItem to="timer">Timer</NavItem>
              <NavItem to="projects">Projects</NavItem>
              {authRole !== UserRole.MEMBER && (
                <>
                  <NavItem to="clients">Clients</NavItem>
                  <NavItem to="team">Team</NavItem>
                </>
              )}
            </nav>
          )}
        </div>

        {isAuthenticated && <AvatarDropdown />}
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
