type DescriptorInsightsProps = {
  title: string
  description: string
}

export const DescriptorInsights = ({
  title,
  description,
}: DescriptorInsightsProps): JSX.Element => {
  return (
    <div className="align-baseline space-y-1">
      <h4 className="font-semibold text-sm text-gray-100">{title}</h4>
      <p className="text-sm text-gray-80">{description}</p>
    </div>
  )
}
