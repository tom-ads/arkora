import { useRoutes } from 'react-router-dom'
import { privateRoutes } from './private'
import { publicRoutes } from './public'

const AppRouter = () => {
  const routes = useRoutes([...publicRoutes, ...privateRoutes])

  return routes
}

export default AppRouter
