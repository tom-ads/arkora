import { staticAppHostname } from 'Config/app'

function getOriginSubdomain(origin: string): string | undefined {
  if (!origin) return

  const partialSubdomain = new URL(origin)?.hostname?.split('.')?.[0]
  if (partialSubdomain === staticAppHostname) return

  return partialSubdomain
}

export { getOriginSubdomain }
