import { NoPermissionCard, Page } from '@/components'
import UserRole from '@/enums/UserRole'
import { useAuth } from '@/hooks/useAuth'
import { Outlet } from 'react-router-dom'

const NoPermissionMessage = () => {
  return (
    <Page>
      <NoPermissionCard redirectTo="/timer" redirectTxt="Back to home" />
    </Page>
  )
}

type AuthorizationProps = {
  allowedRoles: UserRole[]
}

export const Authorization = ({ allowedRoles }: AuthorizationProps): JSX.Element => {
  const { authUser } = useAuth()

  let isAuthorized = false

  if (allowedRoles?.length && authUser?.role) {
    isAuthorized = allowedRoles.includes(authUser.role.name)
  }

  if (!isAuthorized && authUser?.role) {
    return <NoPermissionMessage />
  }

  return <Outlet />
}
