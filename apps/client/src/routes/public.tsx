import { AuthLayout, MainLayout } from '@/components'
import { RegistrationPage } from '@/features/auth'
import { SubdomainPage } from '@/features/subdomain'
import { useLocation } from 'react-router-dom'

export const PublicRoutes = (): JSX.Element => {
  const location = useLocation()
  // const navigate = useNavigate()

  // const { isSuccess } = useVerifySubdomainQuery({
  //   subdomain: window?.location.host?.split('.')?.[0],
  // })

  // if (isSuccess) {
  //   return <Navigate to="/login" />
  // }

  return location.pathname === '/register' ? <MainLayout /> : <AuthLayout />
}

export const publicRoutes = [
  {
    element: <PublicRoutes />,
    children: [
      {
        path: '/',
        element: <SubdomainPage />,
      },
      {
        path: '/register',
        element: <RegistrationPage />,
      },
    ],
  },
]
