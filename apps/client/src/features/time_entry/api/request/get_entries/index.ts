type GetTimeEntriesRequest = Partial<{
  project_id: number
  budget_id: number
  task_id: number
  user_id: number
  start_date: string
  end_date: string
}>

export default GetTimeEntriesRequest
