import ProjectStatus from '@/enums/ProjectStatus'

type Project = {
  id: number
  name: string
  showCost: boolean
  private: boolean
  status: ProjectStatus
}

export default Project
