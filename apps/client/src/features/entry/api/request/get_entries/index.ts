import { BillableTimeEntry } from '@/stores/slices/filters/project'

type GetTimeEntriesRequest = Partial<{
  projectId: number | string
  budgets: (number | string)[]
  tasks: (number | string)[]
  members: (number | string)[]
  startDate: string
  endDate: string
  billable: BillableTimeEntry | null
}>

export default GetTimeEntriesRequest
