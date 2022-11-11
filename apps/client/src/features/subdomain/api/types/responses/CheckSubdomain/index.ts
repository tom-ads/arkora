import { Organisation } from '@/types'

type CheckSubdomainResponse = {
  exists: boolean
  organisation?: Organisation
}

export default CheckSubdomainResponse
