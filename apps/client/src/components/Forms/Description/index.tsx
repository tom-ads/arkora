import { ReactNode } from 'react'

type FormDescriptionProps = {
  children: ReactNode
}

export const FormDescription = ({ children }: FormDescriptionProps): JSX.Element => {
  return <p className="font-medium text-sm text-gray-70 mb-2">{children}</p>
}
