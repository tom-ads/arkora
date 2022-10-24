import { useRoutes } from 'react-router-dom'
import { publicRouteExports } from './public'

const AppRouter = () => {
  const routes = useRoutes([...publicRouteExports])

  return routes
}

export default AppRouter
