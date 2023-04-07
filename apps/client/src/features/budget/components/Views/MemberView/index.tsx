import { BudgetMembersTable } from '../../Tables'

export const BudgetMemberView = (): JSX.Element => {
  return (
    <>
      <BudgetMembersTable
        onDelete={() => {
          /* */
        }}
      />
    </>
  )
}
