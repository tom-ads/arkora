import { Table, TableBody, TableContainer, TableHead, TableHeading, TableRow } from '@/components'

export const ProjectsPage = (): JSX.Element => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[255px]">NAME</TableHeading>
            <TableHeading className="w-20">TYPE</TableHeading>
            <TableHeading className="w-36">RATE</TableHeading>
            <TableHeading className="w-36">ALLOC. BUDGET</TableHeading>
            <TableHeading className="w-[226px]">SPENT / REMAINING</TableHeading>
            <TableHeading className="w-[226px]">BILLABLE / NON-BILLABLE</TableHeading>
            <TableHeading className="w-36">VISIBILITY</TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          <p></p>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
