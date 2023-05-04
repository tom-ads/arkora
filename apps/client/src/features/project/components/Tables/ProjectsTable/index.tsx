import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
  HouseIcon,
} from '@/components'
import { useGetProjectsQuery } from '../../../api'
import { ProjectsRow, ProjectsRowSkeleton } from '../ProjectsRow'
import { useAuth } from '@/hooks/useAuth'
import UserRole from '@/enums/UserRole'
import { useAuthorization } from '@/hooks/useAuthorization'

type ProjectTableProps = {
  onCreate: () => void
  onManage: (id: number) => void
}

export const ProjectsTable = ({ onCreate, onManage }: ProjectTableProps): JSX.Element => {
  const { data: projects, isLoading } = useGetProjectsQuery()

  const { authUser } = useAuth()
  const { checkPermission } = useAuthorization()

  return (
    <TableContainer
      className="min-h-[738px]"
      emptyState={{
        isEmpty: !projects?.length && !isLoading,
        title: 'Projects',
        btnText: 'Create Project',
        onClick: checkPermission('project:create') ? onCreate : undefined,
        icon: <HouseIcon />,
        description:
          authUser?.role?.name !== UserRole.MEMBER
            ? 'Create client projects to track costs and time for each budget and assign the team'
            : 'There are no projects currently assigned to you, speak to your manager to get assigned!',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading first>NAME</TableHeading>
            <TableHeading>CLIENT</TableHeading>
            <TableHeading>TEAM</TableHeading>
            <TableHeading>STATUS</TableHeading>
            <TableHeading>VISIBILITY</TableHeading>
            <TableHeading className="w-10" last></TableHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, idx) => (
                <ProjectsRowSkeleton key={idx} />
              ))}
            </>
          ) : (
            <>
              {projects?.map((project) => (
                <ProjectsRow key={project.id} value={project} onManage={onManage} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
