import { CrossIcon } from '@/components/Icons'
import { ModalDescription } from '../ModalDescription'
import { ModalTitle } from '../ModalTitle'

type ModalHeaderProps = {
  title: string
  description?: string
  icon: JSX.Element
  onClose: () => void
}

export const ModalHeader = ({
  title,
  description,
  icon,
  onClose,
}: ModalHeaderProps): JSX.Element => {
  return (
    <div className="w-full flex justify-between gap-x-4 px-8 pt-8 pb-6">
      <div className="flex gap-x-6">
        <div className="bg-purple-10 text-purple-90 h-14 w-14 rounded-full place-content-center flex-shrink-0 hidden sm:grid">
          <span className="w-7 h-7">{icon}</span>
        </div>
        <div className="space-y-[2px]">
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </div>
      </div>

      <button type="button" onClick={onClose} className="outline-none text-gray-100 mb-auto">
        <CrossIcon className="w-6 h-6" aria-hidden />
      </button>
    </div>
  )
}
