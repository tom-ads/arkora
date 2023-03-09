import { Button } from '@/components/Button'
import classNames from 'classnames'

export type TableEmptyProps = {
  title: string
  description?: string
  btnText?: string
  onClick?: () => void
  icon?: JSX.Element
  className?: string
}

export const TableEmpty = ({
  title,
  description,
  btnText,
  onClick,
  icon,
  className,
}: TableEmptyProps): JSX.Element => {
  return (
    <div
      className={classNames(
        'flex justify-center items-center w-full px-6 py-14 bg-white rounded shadow-glow',
        className,
      )}
    >
      <div className="max-w-[360px] flex flex-col items-center py-6">
        {icon && (
          <div className="bg-purple-10 text-purple-90 h-14 w-14 rounded-full place-content-center grid mb-4">
            <span className="w-7 h-7">{icon}</span>
          </div>
        )}
        <p className="text-gray-100 font-semibold text-[20px] text-center">{title}</p>
        <div className="w-7 h-[2px] bg-purple-90 my-2"></div>
        <p className="text-gray-80 text-base text-center whitespace-normal mb-10">{description}</p>
        {onClick && (
          <Button size="xs" onClick={onClick}>
            {btnText}
          </Button>
        )}
      </div>
    </div>
  )
}
