import { User } from '@/types'
import Client from '@/types/models/Client'
import Project from '@/types/models/Project'

type GetProjectResponse = Project & {
  client: Client
  members: User[]
}

export default GetProjectResponse
