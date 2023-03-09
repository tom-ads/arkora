import { WeekDay } from '@/enums/WeekDay'

type OrganisationCurrency = {
  code: string
  name: string
  symbol: string
}

type Organisation = {
  name: string
  subdomain: string
  openingTime: string
  closingTime: string
  defaultRate: number
  workDays: WeekDay[]
  currency: OrganisationCurrency
}

export type { Organisation, OrganisationCurrency }
