import { Button } from '@/components/Button'

export type TableEmptyProps = {
  title: string
  description?: string
  btnText: string
  btnOnClick: () => void
  icon?: JSX.Element
}

export const TableEmpty = ({
  title,
  description,
  btnText,
  btnOnClick,
  icon,
}: TableEmptyProps): JSX.Element => {
  return (
    <div className="flex justify-center items-center w-full p-6 bg-white rounded shadow-glow">
      <div className="max-w-[360px] flex flex-col items-center py-6">
        {icon && (
          <div className="bg-purple-10 text-purple-90 h-14 w-14 rounded-full place-content-center grid mb-4">
            <span className="w-7 h-7">{icon}</span>
          </div>
        )}
        <p className="text-gray-100 font-semibold text-[20px] text-center">{title}</p>
        <div className="w-7 h-[2px] bg-purple-90 my-2"></div>
        <p className="text-gray-80 text-base text-center whitespace-normal mb-10">{description}</p>
        <Button size="xs" onClick={btnOnClick}>
          {btnText}
        </Button>
      </div>
    </div>
  )
}
