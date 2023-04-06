import { WeekDay } from '@/enums/WeekDay'
import { CurrencyCode } from '@/types'

type UpdateOrganisationRequest = {
  id: number
  name: string
  businessDays: WeekDay[]
  openingTime: string
  closingTime: string
  breakDuration: number
  currency: CurrencyCode
  defaultRate: number
}

export default UpdateOrganisationRequest
