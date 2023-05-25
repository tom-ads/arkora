import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '../CurrencyCode'
import Task from './Task'

type OrganisationCurrency = {
  code: CurrencyCode
  name: string
  symbol: string
}

type Organisation = {
  id: number
  name: string
  subdomain: string
  openingTime: string
  closingTime: string
  breakDuration: number
  defaultRate: number
  businessDays: WeekDay[]
  commonTasks: Task[]
  currency: OrganisationCurrency
  hourlyRate: number
  createdAt: string
}

export type { Organisation, OrganisationCurrency }
