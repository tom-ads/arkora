import { UploadIcon } from '@/components'
import FormDroppable from '@/components/Forms/Droppable'

type DroppableInviteProps = {
  onChange: (file: File[]) => void
  className?: string
}

export const DroppableInvite = ({ onChange, className }: DroppableInviteProps): JSX.Element => {
  return (
    <FormDroppable
      containerStyling={className}
      onChange={onChange}
      acceptedMimes={{
        'text/csv': ['.csv'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      }}
    >
      <div className="flex items-center justify-center gap-1 mb-1 text-purple-90">
        <UploadIcon className="w-7 h-7 flex-shrink-0" />
        <p className="text-gray-100 text-md">
          <span className="font-semibold">Click</span> or{' '}
          <span className="font-semibold">Drag</span> To Upload
        </p>
      </div>

      <p className="text-gray-80 text-sm text-center">
        <span className="font-medium">XLXS</span> or <span className="font-medium">CSV</span> Format
        - Max Size (2MB)
      </p>
    </FormDroppable>
  )
}
