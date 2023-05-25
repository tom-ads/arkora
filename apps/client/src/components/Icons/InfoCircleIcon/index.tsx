/* eslint-disable prettier/prettier */
export const InfoCircleIcon = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      strokeWidth="2.0"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
      <polyline points="11 12 12 12 12 16 13 16" />
    </svg>
  )
}
