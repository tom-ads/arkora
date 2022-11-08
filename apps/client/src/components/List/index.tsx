import { ReactNode } from 'react'
import {
  Control,
  FieldArrayPath,
  FieldValues,
  useFieldArray,
  UseFieldArrayReturn,
} from 'react-hook-form'

interface ListBaseProps<
  TFormValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFormValues>,
> {
  name: TFieldArrayName
  control: Control<TFormValues>
  children: (methods: UseFieldArrayReturn<TFormValues>) => ReactNode
}

export const List = <
  TFormValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFormValues>,
>({
  name,
  control,
  children,
}: ListBaseProps<TFormValues, TFieldArrayName>): JSX.Element => {
  const fields = useFieldArray<TFormValues>({
    name,
    control,
  })

  return <ul className="w-full">{children(fields)}</ul>
}
