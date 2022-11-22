import { Budget } from './Budget'
import Client from './Client'
import Project from './Project'
import { User } from './User'

type ProjectBudget = Project & {
  budgets: Budget[]
  client: Client
  members: User[]
}

export default ProjectBudget
