import classNames from 'classnames'

type HorizontalDividerProps = {
  contentLeft?: JSX.Element
  contentRight?: JSX.Element
  className?: string
}

export const HorizontalDivider = ({
  contentLeft,
  contentRight,
  className,
}: HorizontalDividerProps): JSX.Element => {
  return (
    <div className="flex w-full gap-x-3 items-center">
      {contentLeft}
      <div className={classNames('h-[1px] bg-gray-30 w-full', className)}></div>
      {contentRight}
    </div>
  )
}
