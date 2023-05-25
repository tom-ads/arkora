import ProjectStatus from '@/enums/ProjectStatus'

type CreateProjectRequest = {
  name: string
  client_id: number
  show_cost: boolean
  private: boolean
  status: ProjectStatus
}

export default CreateProjectRequest
