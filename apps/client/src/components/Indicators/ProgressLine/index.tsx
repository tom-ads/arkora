type ProgressLineIndicatorProps = {
  percent: string | number
}

export const ProgressLineIndicator = ({ percent }: ProgressLineIndicatorProps): JSX.Element => {
  return (
    <svg width="100%" height="10" className="outline-none relative">
      <rect width="100%" height="10" rx="2" className="fill-purple-20" strokeLinecap="round" />
      <rect
        width={`${percent}%`}
        height="10"
        rx="2"
        className="transition-width ease-in-out duration-300 fill-purple-90"
        strokeDasharray="100, 100"
        strokeLinecap="round"
      />
    </svg>
  )
}
