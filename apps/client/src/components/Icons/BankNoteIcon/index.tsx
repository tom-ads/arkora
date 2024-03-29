/* eslint-disable prettier/prettier */
export const BankNoteIcon = ({ className }: { className?: string }): JSX.Element => {
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
      <circle cx="12" cy="12" r="3" />
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <line x1="18" y1="12" x2="18.01" y2="12" />
      <line x1="6" y1="12" x2="6.01" y2="12" />
    </svg>
  )
}
