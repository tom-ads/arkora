import { Budget } from './Budget'
import Client from './Client'
import Project from './Project'

type ProjectBudget = Project & {
  budgets: Budget[]
  client: Client
}

export default ProjectBudget
