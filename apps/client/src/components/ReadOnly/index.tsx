import { twMerge } from 'tailwind-merge'

export const ReadOnly = ({
  value,
  className,
}: {
  value: string | null
  className?: string
}): JSX.Element => {
  return <p className={twMerge('text-gray-80 capitalize', className)}>{value || '- - -'}</p>
}
