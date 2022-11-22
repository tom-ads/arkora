/* eslint-disable prettier/prettier */
export const DotsIcon = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
      <circle cx="12" cy="5" r="1" />
    </svg>
  )
}
