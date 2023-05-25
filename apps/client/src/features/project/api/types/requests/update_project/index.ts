import ProjectStatus from '@/enums/ProjectStatus'

type UpdateProjectRequest = {
  id: number
  name: string
  client_id: number
  show_cost: boolean
  private: boolean
  status: ProjectStatus
}

export default UpdateProjectRequest
