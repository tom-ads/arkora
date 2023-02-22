import { Button, CrossIcon, FileIcon } from '@/components'

type SelectedFileProps = {
  value: File | null
  onClick?: () => void
}

export const SelectedFile = ({ value, onClick }: SelectedFileProps): JSX.Element => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={(event) => event.stopPropagation()}
      className="border border-dashed rounded-[4px] px-4 py-[10px] flex items-center w-full text-purple-90 bg-white cursor-default"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <FileIcon className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm truncate max-w-[380px]">
            {value?.name ?? '- - -'}
          </span>
        </div>

        {!!onClick && (
          <Button
            variant="blank"
            className="min-h-0"
            onClick={(event) => {
              event.stopPropagation()
              onClick()
            }}
          >
            <div className="w-5 h-5 hover:bg-gray-10 grid place-content-center rounded">
              <CrossIcon className="w-4 h-4" />
            </div>
          </Button>
        )}
      </div>
    </div>
  )
}
