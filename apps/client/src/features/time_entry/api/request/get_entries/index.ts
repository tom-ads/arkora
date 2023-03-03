import { BillableTimeEntry } from '@/stores/slices/filters/project'

type GetTimeEntriesRequest = Partial<{
  project_id: number
  budget_id: number
  task_id: number
  user_id: number
  start_date: string
  end_date: string
  billable: BillableTimeEntry | null
}>

export default GetTimeEntriesRequest
