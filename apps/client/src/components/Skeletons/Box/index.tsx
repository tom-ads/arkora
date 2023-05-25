import classNames from 'classnames'

type SkeletonBoxProps = {
  width?: number | string
  height: number | string
  randomWidth?: boolean
  className?: string
}

export const SkeletonBox = ({
  width,
  randomWidth,
  height,
  className,
}: SkeletonBoxProps): JSX.Element => {
  return (
    <div
      className={classNames('animate-pulse bg-purple-10 rounded-sm', className)}
      style={{ width: randomWidth ? `${Math.random() * 100}%` : width, height }}
    ></div>
  )
}
