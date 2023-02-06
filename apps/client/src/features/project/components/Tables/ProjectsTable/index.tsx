import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
  TableData,
  InlineLink,
  ChevronIcon,
  Badge,
  AvatarLimit,
  Button,
} from '@/components'
import { ExpandableRow } from '@/components/Table/ExpandableRow'
import Status from '@/enums/Status'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { useGetProjectsQuery } from '../../../api'

type ProjectTableProps = {
  onManage: (id: number) => void
}

export const ProjectsTable = ({ onManage }: ProjectTableProps): JSX.Element => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const { data } = useGetProjectsQuery()

  const handleExpandedRow = (projectId: number) => {
    setExpandedRow(expandedRow !== projectId ? projectId : null)
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[32px]" first></TableHeading>
            <TableHeading className="max-w-[355px]">NAME</TableHeading>
            <TableHeading className="max-w-[355px]">CLIENT</TableHeading>
            <TableHeading className="max-w-[255px]">TEAM</TableHeading>
            <TableHeading className="max-w-[255px]">STATUS</TableHeading>
            <TableHeading className="max-w-[100px]">VISIBILITY</TableHeading>
            <TableHeading className="w-[86px]" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((project) => (
            <Fragment key={`project-${project?.id}`}>
              <TableRow>
                <TableData>
                  <button onClick={() => handleExpandedRow(project.id)}>
                    <ChevronIcon
                      className={classNames(
                        'w-5 h-5 transition-transform duration-150 transform text-gray-90',
                        {
                          '-rotate-90': project.id !== expandedRow,
                        },
                      )}
                    />
                  </button>
                </TableData>
                <TableData className="truncate">
                  <InlineLink className="font-medium" to={`/projects/${project.id}`}>
                    {project.name}
                  </InlineLink>
                </TableData>
                <TableData>{project.client.name}</TableData>
                <TableData>
                  <AvatarLimit
                    values={project.members.map((member) => ({
                      id: member.id,
                      value: member.initials,
                    }))}
                  />
                </TableData>
                <TableData>
                  {project.status === Status.ACTIVE && <Badge variant="success">Active</Badge>}
                  {project.status === Status.INACTIVE && <Badge variant="warn">Inactive</Badge>}
                </TableData>
                <TableData>{project.private ? 'Private' : 'Public'}</TableData>
                <TableData>
                  <Button variant="blank" onClick={() => onManage(project.id)}>
                    Manage
                  </Button>
                </TableData>
              </TableRow>
              {/* Project Budgets Expandable */}
              <ExpandableRow show={expandedRow === project.id}>
                <TableData colSpan={6}>
                  <Table>
                    <TableHead>
                      <TableHeading className="max-w-[255px]">Budget</TableHeading>
                      <TableHeading className="max-w-[255px]">Type</TableHeading>
                      <TableHeading className="max-w-[255px]">Rate</TableHeading>
                      <TableHeading className="max-w-[255px]">Alloc. Hours</TableHeading>
                      <TableHeading className="max-w-[255px]">Spent / Remaining</TableHeading>
                      <TableHeading className="max-w-[255px]">Billable / Non-Billable</TableHeading>
                    </TableHead>
                  </Table>
                </TableData>
              </ExpandableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
