import { Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from '../pages/ForgotPassword'
import { LoginPage } from '../pages/Login'
import { RegistrationPage } from '../pages/Registration'

export const AuthRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  )
}
