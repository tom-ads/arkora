import { MainLayout } from '@/components'
import { BudgetRoutes } from '@/features/budget'
import { ClientRoutes } from '@/features/client'
import { ProjectRoutes } from '@/features/project'
import { TeamRoutes } from '@/features/team'
import { TimerRoute } from '@/features/timer'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoutes = (): JSX.Element => {
  const location = useLocation()

  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <MainLayout />
}

export const privateRoutes = [
  {
    element: <ProtectedRoutes />,
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
