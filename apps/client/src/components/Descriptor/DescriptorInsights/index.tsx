import classNames from 'classnames'

type DescriptorInsightsProps = {
  title: string
  className?: string
  description: string
}

export const DescriptorInsights = ({
  title,
  className,
  description,
}: DescriptorInsightsProps): JSX.Element => {
  return (
    <div className={classNames('align-baseline space-y-1 w-full', className)}>
      <h4 className="font-semibold text-sm text-gray-100">{title}</h4>
      <p className="text-sm text-gray-80">{description}</p>
    </div>
  )
}
