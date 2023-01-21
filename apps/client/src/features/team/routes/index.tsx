import { Page, PageHeader } from '@/components'
import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { MembersPage, TimersPage } from '../pages'

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
      <Route index element={<TeamRedirect />} />
      <Route path="members" element={<MembersPage />} />
      <Route path="timers" element={<TimersPage />} />
    </Routes>
  )
}
