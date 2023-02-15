/* eslint-disable prettier/prettier */
export const PauseIcon = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <rect x="6" y="5" width="4" height="14" fill="currentColor" rx="1" />
      <rect x="14" y="5" width="4" height="14" fill="currentColor" rx="1" />
    </svg>
  )
}
