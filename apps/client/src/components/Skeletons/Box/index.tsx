type SkeletonBoxProps = {
  width?: number | string
  height: number | string
  randomWidth?: boolean
}

export const SkeletonBox = ({ width, randomWidth, height }: SkeletonBoxProps): JSX.Element => {
  return (
    <div
      className="animate-pulse bg-purple-10 rounded-sm"
      style={{ width: randomWidth ? `${Math.random() * 100}%` : width, height }}
    ></div>
  )
}
