export const ReadOnly = ({ value }: { value: string | null }): JSX.Element => {
  return <p className="text-gray-80 capitalize">{value || '- - -'}</p>
}
