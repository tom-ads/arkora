import { AuthLayout } from '@/components'
import { SubdomainRoutes } from '@/features/subdomain'

export const PublicRoutes = (): JSX.Element => {
  return <AuthLayout />
}

export const publicRouteExports = [
  {
    element: <PublicRoutes />,
    children: [
      {
        path: '/*',
        element: <SubdomainRoutes />,
      },
    ],
  },
]
