import { InfoCircleIcon } from '../Icons'

type InlineTipProps = {
  value: string
}

export const InlineTip = ({ value }: InlineTipProps): JSX.Element => {
  return (
    <div className="flex items-center gap-1">
      <InfoCircleIcon className="w-5 h-5 shrink-0 text-purple-90" />
      <p className="text-gray-70 text-sm font-medium">{value}</p>
    </div>
  )
}
