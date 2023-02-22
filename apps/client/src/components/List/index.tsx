import classNames from 'classnames'
import { ReactNode } from 'react'
import {
  ArrayPath,
  Control,
  FieldArrayPath,
  FieldArrayWithId,
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
  listClassName?: string
  itemClassName?: string
  children: ({
    field,
    itemIdx,
    methods,
  }: {
    field: FieldArrayWithId<TFormValues, ArrayPath<TFormValues>, 'id'>
    itemIdx: number
    methods?: UseFieldArrayReturn<TFormValues>
  }) => ReactNode
}

export const List = <
  TFormValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFormValues>,
>({
  name,
  control,
  listClassName,
  itemClassName,
  children,
}: ListBaseProps<TFormValues, TFieldArrayName>): JSX.Element => {
  const methods = useFieldArray<TFormValues>({
    name,
    control,
  })

  return (
    <ul className={classNames('w-full space-y-2', listClassName)}>
      {methods?.fields?.map((field, itemIdx) => (
        <li key={field.id} className={classNames('w-full', itemClassName)}>
          {children({ field, methods, itemIdx })}
        </li>
      ))}
    </ul>
  )
}
