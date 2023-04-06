import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '@/types'
import Task from '@/types/models/Task'

export type OrganisationFormFields = {
  name: string
  subdomain: string
  businessDays: WeekDay[]
  openingTime: string
  closingTime: string
  breakDuration: string
  currency: CurrencyCode
  defaultRate: number
}

type TaskSubSet = Pick<Task, 'name' | 'isBillable'>

export type OrganisationWithTasksFormFields = OrganisationFormFields & {
  defaultTasks: TaskSubSet[]
}
