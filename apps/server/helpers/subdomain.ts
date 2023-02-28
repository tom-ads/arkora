import { staticAppHostname } from 'Config/app'
import Env from '@ioc:Adonis/Core/Env'

function getOriginSubdomain(origin: string): string | undefined {
  if (!origin) return

  const partialSubdomain = new URL(origin)?.host?.split('.')?.[0]
  if (partialSubdomain === staticAppHostname) return

  return partialSubdomain
}

function getTenantHostname(subdomain: string) {
  const protocol: 'http' | 'https' = Env.get('NODE_ENV') === 'development' ? 'http' : 'https'
  return `${protocol}://${subdomain}.${staticAppHostname}`
}

export { getOriginSubdomain, getTenantHostname }
