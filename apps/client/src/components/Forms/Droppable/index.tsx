import classNames from 'classnames'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { FileRejection, ErrorCode } from 'react-dropzone'

type AcceptedMimes = Record<string, string[]>

type FormDroppableProps = {
  maxFiles?: number
  disabled?: boolean
  inputStyling?: string
  maxSizeInBytes?: number
  containerStyling?: string
  acceptedMimes?: AcceptedMimes
  onChange: (files: File[]) => void
  children: JSX.Element | JSX.Element[]
}

const FormDroppable = ({
  children,
  disabled,
  onChange,
  maxFiles = 1,
  inputStyling,
  acceptedMimes = { 'text/plain': ['.txt'], 'image/jpeg': ['.jpeg', '.jpg'] },
  containerStyling,
  maxSizeInBytes = 2097152, // 2MB
}: FormDroppableProps) => {
  const [filesRejections, setFilesRejections] = useState<string[]>([])

  const handleFileRejection = (fileRejections: FileRejection[]) => {
    setFilesRejections(
      fileRejections
        .map((fileErrors) => {
          return fileErrors.errors
            .map((fileError) => {
              switch (fileError.code) {
                case ErrorCode.FileTooLarge:
                  return `File is too large. It must not exceed ${maxSizeInBytes / 1024 / 1024}MB`
                case ErrorCode.TooManyFiles:
                  return `You can only upload a maximum of ${maxFiles} files.`
                case ErrorCode.FileInvalidType:
                  return 'File type must be PNG or JPEG.'
                default:
                  return ''
              }
            })
            .filter((m) => m)
        })
        .flat(),
    )
  }

  return (
    <Dropzone
      onDrop={onChange}
      disabled={disabled}
      maxFiles={maxFiles}
      useFsAccessApi={false}
      accept={acceptedMimes}
      maxSize={maxSizeInBytes}
      onDropAccepted={() => setFilesRejections([])}
      onDropRejected={handleFileRejection}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps({
            className: classNames(
              'px-3 py-4 w-full relative',
              'cursor-pointer',
              'flex flex-col items-center justify-center',
              'border border-dashed rounded-[4px] border-gray-40 hover:border-purple-90 focus-visible:border-purple-90 outline-none',
              'hover:bg-purple-10 focus:bg-purple-10 focus-visible:bg-purple-10',
              'transition',
              { 'cursor-default': disabled },
              containerStyling,
            ),
          })}
        >
          <input {...getInputProps({ className: inputStyling })} />
          <div className="w-full relative">{children}</div>

          <div className="mt-2 pointer-events-none text-center">
            {filesRejections?.map((rejection, idx) => (
              <p key={idx} className="text-sm font-bold text-red-90">
                {rejection}
              </p>
            ))}
          </div>
        </div>
      )}
    </Dropzone>
  )
}

export default FormDroppable
