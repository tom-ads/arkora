import { ReactNode, useMemo } from 'react'
import { Avatar } from '../Avatar'

type AvatarLimitProps = {
  limit?: number
  values: string[]
}

export const AvatarLimit = ({ limit = 3, values }: AvatarLimitProps): JSX.Element => {
  const limitedChildren = useMemo(() => {
    return {
      avatars: values?.length ? [...values].splice(0, limit) : [],
      offset: values?.length - limit,
    }
  }, [values, limit])

  if (!values?.length) {
    return <span>Not Assigned</span>
  }

  return (
    <div className="flex gap-x-1 items-center">
      {limitedChildren.avatars?.map((avatar) => (
        <Avatar key={avatar}>{avatar}</Avatar>
      ))}
      {limitedChildren?.offset > 0 && (
        <span className="text-gray-80 ml-1 font-medium">+{limitedChildren?.offset ?? 0}</span>
      )}
    </div>
  )
}
