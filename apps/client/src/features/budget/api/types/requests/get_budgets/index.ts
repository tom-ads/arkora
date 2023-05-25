import ProjectStatus from '@/enums/ProjectStatus'

type GetBudgetsRequest = Partial<{
  projectId: number | string
  userId: number | string
  projectStatus: ProjectStatus
  includeProject: boolean
}>

export default GetBudgetsRequest
