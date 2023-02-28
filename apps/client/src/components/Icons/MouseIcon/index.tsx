/* eslint-disable prettier/prettier */
export const MouseIcon = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="6" y="3" width="12" height="18" rx="4" />
      <line x1="12" y1="7" x2="12" y2="11" />
    </svg>
  )
}
