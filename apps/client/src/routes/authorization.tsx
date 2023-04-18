import { Button, Card, KeyIcon, Page } from '@/components'
import UserRole from '@/enums/UserRole'
import { useAuth } from '@/hooks/useAuth'
import { Outlet, useNavigate } from 'react-router-dom'

const NoPermissionMessage = () => {
  const navigate = useNavigate()

  return (
    <Page>
      <Card className="min-h-[600px] grid place-content-center">
        <div className="max-w-sm flex flex-col items-center">
          <KeyIcon className="w-32 h-32 text-purple-90 mb-6" />
          <div className="text-center space-y-1">
            <p className="text-gray-100 font-semibold text-2xl">No Permissions</p>
            <p className="text-gray-80 text-center">
              You lack the permission to view this resource, please contact your administrator, if
              you think this is an error.
            </p>
          </div>

          <Button onClick={() => navigate('/timer')} size="xs" className="!mt-10" block>
            Back to home
          </Button>
        </div>
      </Card>
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
