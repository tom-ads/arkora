import { MainLayout } from '@/components'
import { BudgetRoutes } from '@/features/budget'
import { ClientRoutes } from '@/features/client'
import { ProjectRoutes } from '@/features/project'
import { TeamRoutes } from '@/features/team'
import { TimerRoute } from '@/features/timer'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export const PrivateRoutes = (): JSX.Element => {
  const location = useLocation()

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />
  }

  return <MainLayout />
}

export const privateRoutes = [
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: '/projects/*',
        element: <ProjectRoutes />,
      },
      {
        path: '/timer/*',
        element: <TimerRoute />,
      },
      {
        path: '/clients/*',
        element: <ClientRoutes />,
      },
      {
        path: '/team/*',
        element: <TeamRoutes />,
      },
      {
        path: '/budgets/*',
        element: <BudgetRoutes />,
      },
    ],
  },
]
