import classNames from 'classnames'

type VerticalDividerProps = {
  className?: string
}

export const VerticalDivider = ({ className }: VerticalDividerProps): JSX.Element => {
  return <div className={classNames('h-5 w-[1px] bg-gray-30', className)}></div>
}
