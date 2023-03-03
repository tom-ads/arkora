type SkeletonCircleProps = {
  width: number
  height: number
}

export const SkeletonCircle = ({ width, height }: SkeletonCircleProps): JSX.Element => {
  return <div className="animate-pulse bg-purple-10 rounded-full" style={{ width, height }}></div>
}
