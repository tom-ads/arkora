import { useRoutes } from 'react-router-dom'
import { publicRoutes } from './public'

const AppRouter = () => {
  const routes = useRoutes([...publicRoutes])

  return routes
}

export default AppRouter
