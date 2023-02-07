import { Table, TableBody, TableContainer, TableHead, TableHeading, TableRow } from '@/components'
import { ReactNode } from 'react'

export const BudgetsTable = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[32px]" first></TableHeading>
            <TableHeading className="w-[225px]">NAME</TableHeading>
            <TableHeading className="w-[160px]">TYPE</TableHeading>
            <TableHeading className="w-[130px]">RATE (HRS)</TableHeading>
            <TableHeading>ALLOC. BUDGET</TableHeading>
            <TableHeading className="w-[230px]">SPENT</TableHeading>
            <TableHeading className="w-[230px]">BILLABLE / NON-BILLABLE</TableHeading>
            <TableHeading className="max-w-[355px]">VISIBILITY</TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  )
}
