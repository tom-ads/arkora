export const BorderNone = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="4" y1="4" x2="4" y2="4.01" />
      <line x1="8" y1="4" x2="8" y2="4.01" />
      <line x1="12" y1="4" x2="12" y2="4.01" />
      <line x1="16" y1="4" x2="16" y2="4.01" />
      <line x1="20" y1="4" x2="20" y2="4.01" />
      <line x1="4" y1="8" x2="4" y2="8.01" />
      <line x1="12" y1="8" x2="12" y2="8.01" />
      <line x1="20" y1="8" x2="20" y2="8.01" />
      <line x1="4" y1="12" x2="4" y2="12.01" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <line x1="16" y1="12" x2="16" y2="12.01" />
      <line x1="20" y1="12" x2="20" y2="12.01" />
      <line x1="4" y1="16" x2="4" y2="16.01" />
      <line x1="12" y1="16" x2="12" y2="16.01" />
      <line x1="20" y1="16" x2="20" y2="16.01" />
      <line x1="4" y1="20" x2="4" y2="20.01" />
      <line x1="8" y1="20" x2="8" y2="20.01" />
      <line x1="12" y1="20" x2="12" y2="20.01" />
      <line x1="16" y1="20" x2="16" y2="20.01" />
      <line x1="20" y1="20" x2="20" y2="20.01" />
    </svg>
  )
}
