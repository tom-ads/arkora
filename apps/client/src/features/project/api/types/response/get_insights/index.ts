import Status from '@/enums/Status'

type GetProjectInsightsResponse = {
  allocatedCost: number
  allocatedDuration: number
  usedCost: number
  usedDuration: number

  billableDuration: number
  billableCost: number
  unbillableDuration: number
  unbillableCost: number

  revenue: number
  expenses: number
  profit: number
  remainingCost: number
  remainingDuration: number

  status: Status
  private: boolean
}

export default GetProjectInsightsResponse
