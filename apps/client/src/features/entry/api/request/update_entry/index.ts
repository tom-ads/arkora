type UpdateTimeEntryRequest = {
  timer_id: number
  budget_id: number
  task_id: number
  date: string
  description: string
  estimated_minutes: number
  duration_minutes: number
}

export default UpdateTimeEntryRequest
