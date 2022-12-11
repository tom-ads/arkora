type CreateTimerRequest = {
  budget_id: number
  task_id: number
  date: string
  duration_minutes: number
  estimated_minutes: number
  description?: string
}

export default CreateTimerRequest
