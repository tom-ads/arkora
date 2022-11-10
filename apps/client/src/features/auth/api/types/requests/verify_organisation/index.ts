import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '@/types/CurrencyCode'

type VerifyOrganisationRequest = {
  name: string
  subdomain: string
  opening_time: string
  closing_time: string
  work_days: WeekDay[]
  currency: CurrencyCode
  hourly_rate: number
}

export default VerifyOrganisationRequest
