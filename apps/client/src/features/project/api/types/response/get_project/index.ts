import { User } from '@/types'
import Client from '@/types/Client'
import Project from '@/types/Project'

type GetProjectResponse = Project & {
  client: Client
  members: User[]
}

export default GetProjectResponse
