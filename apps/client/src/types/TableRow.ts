export interface TableRowBaseProps<T> {
  value: T
  onManage?: (id: number) => void
}
