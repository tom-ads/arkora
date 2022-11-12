import UserRole from '@/enums/UserRole'
import VerifyDetailsRequest from '../verify_details'
import VerifyOrganisationRequest from '../verify_organisation'

type RegisterRequest = {
  members: Array<{
    email: string
    role: Exclude<UserRole, 'OWNER'>
  }>
} & VerifyDetailsRequest &
  VerifyOrganisationRequest

export default RegisterRequest
