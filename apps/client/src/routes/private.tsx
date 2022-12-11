import { MainLayout } from '@/components'
import { ProjectRoutes } from '@/features/project'
import { TimerRoute } from '@/features/timer'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const PrivateRoutes = (): JSX.Element => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />
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
    ],
  },
]
