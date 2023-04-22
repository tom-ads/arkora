import Status from '@/enums/Status'
import { BaseMetrics } from '@/types'

type GetProjectInsightsResponse = BaseMetrics & {
  status: Status
  private: boolean
}

export default GetProjectInsightsResponse
