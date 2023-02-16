import UserRole from '@/enums/UserRole'
import { TeamMemberStatus } from '@/stores/slices/filters/team_members'

type GetAccountsRequest = Partial<{
  search: string | null
  role: UserRole | null
  status: TeamMemberStatus | null
  page: number | null
}>

export default GetAccountsRequest
