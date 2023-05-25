import { SkeletonBox } from '@/components/Skeletons'
import { ReactNode } from 'react'

type PageTitleProps = {
  loading?: boolean
  children: ReactNode
}

export const PageTitle = ({ loading, children }: PageTitleProps): JSX.Element => {
  if (loading) {
    return <SkeletonBox className="bg-purple-80" height={50} width={400} />
  }

  return (
    <h1 className="text-white font-semibold text-xl md:text-2xl lg:text-4xl mb-1">{children}</h1>
  )
}
