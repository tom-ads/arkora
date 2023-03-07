export const ReadOnly = ({ value }: { value: string | null }): JSX.Element => {
  if (!value) {
    return <p>- - -</p>
  }

  return <p className="text-gray-80 capitalize">{value}</p>
}
