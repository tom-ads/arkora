import { cva, VariantProps } from 'class-variance-authority'
import { MouseEvent } from 'react'
import { CrossIcon } from '../Icons'

const toast = cva('shadow-glow p-3 text-sm rounded flex gap-x-3 w-[300px]', {
  variants: {
    variant: {
      default: 'bg-gray-10 text-gray-70 shadow-gray-10',
      success: 'bg-green-10 text-green-60 shadow-green-10',
      error: 'bg-red-10 text-red-60 shadow-red-10',
      warning: 'bg-yellow-10 text-yellow-60 shadow-yellow-10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface ToastProps extends VariantProps<typeof toast> {
  message: string
  dismiss?: () => void
}

export const Toast = ({ variant, message, dismiss }: ToastProps) => {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (dismiss) {
      dismiss()
    }
  }

  return (
    <div className={toast({ variant })}>
      <span className="flex-grow">{message}</span>
      <button type="button" className="flex-shrink-0 w-4 h-4" onClick={onClick}>
        <CrossIcon />
      </button>
    </div>
  )
}
