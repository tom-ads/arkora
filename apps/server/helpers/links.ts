import { getTenantHostname } from './subdomain'

function generateInvitiationUrl(origin: string, email: string, token: string) {
  return `${origin}/invitation?email=${email}&token=${token}`
}

function generatePasswordResetLink(subdomain: string, userId: number, token: string) {
  return `${getTenantHostname(subdomain)}/reset-password?user_id=${userId}&token=${token}`
}

export { generateInvitiationUrl, generatePasswordResetLink }
