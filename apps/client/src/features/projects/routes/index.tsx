import { Route, Routes } from 'react-router-dom'
import { ProjectPage } from '../pages/Project'
import { ProjectsPage } from '../pages/Projects'

export const ProjectRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<ProjectsPage />} />
      <Route path=":projectId" element={<ProjectPage />} />
    </Routes>
  )
}
