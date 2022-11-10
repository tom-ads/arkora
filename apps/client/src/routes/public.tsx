import { AuthLayout, MainLayout } from '@/components'
import { LoginPage, RegistrationPage } from '@/features/auth'
import { SubdomainPage, useCheckSubdomainQuery } from '@/features/subdomain'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const PublicRoutes = (): JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()

  const { data, isSuccess } = useCheckSubdomainQuery({
    subdomain: window?.location.host?.split('.')?.[0],
  })

  /*
    If subdomain exists, redirect to organisation portal
  */
  useEffect(() => {
    if (isSuccess && location.pathname !== '/register') {
      navigate(data?.exists ? '/login' : '/')
    }
  }, [data?.exists, location?.pathname])

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
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]
