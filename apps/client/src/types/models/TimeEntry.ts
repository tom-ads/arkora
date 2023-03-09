import { Budget } from './Budget'
import Project from './Project'
import Task from './Task'
import { User } from './User'

type TimeEntry = {
  id: number
  taskId: number
  budgetId: number
  date: string
  durationMinutes: number
  estimatedMinutes: number
  description: string
  lastStartedAt: string
  lastStoppedAt: string
  budget: Budget & { project: Project }
  task: Task
  user: User
  isBillable: boolean
}

export default TimeEntry
