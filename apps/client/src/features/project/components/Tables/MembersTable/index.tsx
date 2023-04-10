import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
  UserIcon,
} from '@/components'
import { useGetProjectQuery } from './../../../api'
import { useParams } from 'react-router-dom'
import { MemberRow } from '../MemberRow'
import { useGetProjectMembersQuery } from '@/features/project_members'

type TableProps = {
  onDelete: (id: number) => void
}

export const MembersTable = ({ onDelete }: TableProps): JSX.Element => {
  const { projectId } = useParams()

  const { data: project } = useGetProjectQuery(projectId!, { skip: !projectId })

  const { data: projectMembers, isLoading: loadingMembers } = useGetProjectMembersQuery(
    { projectId: projectId! },
    { skip: !projectId },
  )

  return (
    <TableContainer
      className="min-h-[778px]"
      emptyState={{
        isEmpty: !projectMembers?.length && !loadingMembers,
        icon: <UserIcon />,
        title: 'No Members Assigned',
        description:
          'Add members to the project, so they can be assigned to budgets for tracking time',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[220px]"></TableHeading>
            <TableHeading className="w-[210px]">Email</TableHeading>
            <TableHeading className="w-[100px]">SPENT</TableHeading>
            <TableHeading className="w-[150px]">BILLABLE / NON-BILLABLE</TableHeading>
            <TableHeading className="w-[100px]" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {projectMembers?.map((member) => (
            <MemberRow
              onDelete={onDelete}
              key={member.id}
              value={member}
              isPrivate={project?.private ?? true}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
