import { AuthLayout, MainLayout, Spinner } from '@/components'
import { LoginPage, RegistrationPage } from '@/features/auth'
import { SubdomainPage, SubdomainNotFoundPage, useCheckSubdomainQuery } from '@/features/subdomain'
import { setOrganisation } from '@/stores/slices/organisation'
import { RootState } from '@/stores/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const Loader = () => {
  return (
    <div className="min-h-full grid place-content-center">
      <Spinner className="text-purple-90 w-12 h-12 stroke-[10px]" />
    </div>
  )
}

export const PublicRoutes = (): JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()
  const disptach = useDispatch()

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const { data, isSuccess, isLoading } = useCheckSubdomainQuery({
    subdomain: window?.location.host?.split('.')?.[0],
  })

  useEffect(() => {
    if (isSuccess && location.pathname !== '/register') {
      if (data.exists) {
        disptach(setOrganisation({ ...data.organisation }))
      }
      navigate(data?.exists ? '/login' : '/', { replace: true })
    }
  }, [data?.exists, location?.pathname])

  if (isLoading) {
    return <Loader />
  }

  if (
    data?.exists !== undefined &&
    !data?.exists &&
    window?.location.host?.split('.')?.[0] !== import.meta.env.VITE_ARKORA_STATIC_HOSTNAME &&
    window?.location.host?.split('.')?.[0] !== 'arkora'
  ) {
    return <SubdomainNotFoundPage />
  }

  if (isAuthenticated) {
    return <Navigate to="/projects" replace={true} />
  }

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
