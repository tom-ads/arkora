import { Route, Routes } from 'react-router-dom'
import { ClientsPage } from '../pages'

export const ClientRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<ClientsPage />} />
    </Routes>
  )
}
