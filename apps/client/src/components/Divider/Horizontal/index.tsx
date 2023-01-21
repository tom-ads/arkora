import classNames from 'classnames'

type HorizontalDividerProps = {
  className?: string
}

export const HorizontalDivider = ({ className }: HorizontalDividerProps): JSX.Element => {
  return <div className={classNames('h-[1px] bg-gray-30 w-full', className)}></div>
}
