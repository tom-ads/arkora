import { Page, PageHeader } from '@/components'
import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { MembersPage, TimersPage } from '../pages'
import { Authorization } from '@/routes/authorization'
import UserRole from '@/enums/UserRole'

const TeamRedirect = (): JSX.Element => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/team/members')
  }, [])

  return (
    <Page>
      <PageHeader>
        <></>
      </PageHeader>
    </Page>
  )
}

export const TeamRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route
        element={
          <Authorization allowedRoles={[UserRole.OWNER, UserRole.ORG_ADMIN, UserRole.MANAGER]} />
        }
      >
        <Route index element={<TeamRedirect />} />
        <Route path="members">
          <Route path="" element={<MembersPage />} />
          <Route path=":memberId" element={<MembersPage />} />
        </Route>

        <Route path="timers" element={<TimersPage />} />
      </Route>
    </Routes>
  )
}
