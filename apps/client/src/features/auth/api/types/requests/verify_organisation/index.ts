import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '@/types/CurrencyCode'

type VerifyOrganisationRequest = {
  name: string
  subdomain: string
  openingTime: string
  closingTime: string
  businessDays: WeekDay[]
  currency: CurrencyCode
  defaultRate: number
  breakDuration: number
}

export default VerifyOrganisationRequest
