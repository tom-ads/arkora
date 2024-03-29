import classNames from 'classnames'

type DoubleProgressBarProps = {
  leftPercent: number | string
  rightPercent: number | string
}

export const DoubleProgressBar = ({
  leftPercent,
  rightPercent,
}: DoubleProgressBarProps): JSX.Element => {
  return (
    <div className="flex justify-between h-[10px] w-full bg-gray-20">
      <div
        style={{
          height: 10,
          width: `${leftPercent}%`,
        }}
        className={classNames(
          'transition-width ease-in-out duration-300 bg-green-90 rounded-l-[2px]',
          {
            'rounded-r-[2px]': leftPercent >= 100,
          },
        )}
      ></div>
      <div
        style={{
          height: 10,
          width: `${rightPercent}%`,
        }}
        className={classNames(
          'transition-width ease-in-out duration-300 bg-red-90 rounded-r-[2px]',
          {
            'rounded-l-[2px]': rightPercent >= 100,
          },
        )}
      ></div>
    </div>
  )
}
