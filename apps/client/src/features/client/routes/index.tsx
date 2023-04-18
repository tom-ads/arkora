import { Route, Routes } from 'react-router-dom'
import { ClientsPage } from '../pages'
import { Authorization } from '@/routes/authorization'
import UserRole from '@/enums/UserRole'

export const ClientRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={
          <Authorization allowedRoles={[UserRole.OWNER, UserRole.ORG_ADMIN, UserRole.MANAGER]} />
        }
      >
        <Route index element={<ClientsPage />} />
        <Route path=":clientId" element={<ClientsPage />} />
      </Route>
    </Routes>
  )
}
