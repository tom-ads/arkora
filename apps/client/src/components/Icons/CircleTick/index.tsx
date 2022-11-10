/* eslint-disable prettier/prettier */
export const CircleTick = ({ className }: { className?: string }): JSX.Element => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 13" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.5 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11ZM0 6.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Zm9.098-1.193a.375.375 0 0 0-.53-.53L5.917 7.428 4.723 6.235a.375.375 0 0 0-.53.53l1.459 1.458a.375.375 0 0 0 .53 0l2.916-2.916Z"
      />
    </svg>
  )
}
