import { Budget } from './Budget'
import Task from './Task'

type TimeEntry = {
  id: number
  date: string
  durationMinutes: number
  estimatedMinutes: number
  description: string
  lastStartedAt: string
  lastStoppedAt: string
  budget: Budget & { projectName: string }
  task: Task
}

export default TimeEntry
