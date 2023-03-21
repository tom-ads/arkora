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

type ProjectTableProps = {
  onCreate: () => void
  onManage: (id: number) => void
}

export const ProjectsTable = ({ onCreate, onManage }: ProjectTableProps): JSX.Element => {
  const { data: projects, isLoading } = useGetProjectsQuery()

  return (
    <TableContainer
      className="min-h-[738px]"
      emptyState={{
        isEmpty: !projects?.length && !isLoading,
        title: 'Projects',
        btnText: 'Create Project',
        onClick: onCreate,
        icon: <HouseIcon />,
        description:
          'Create client projects to track costs and time for each budget and assign the team',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeading className="w-[270px]" first>
              NAME
            </TableHeading>
            <TableHeading className="w-[270px]">CLIENT</TableHeading>
            <TableHeading className="w-[200px]">TEAM</TableHeading>
            <TableHeading className="w-[120px]">STATUS</TableHeading>
            <TableHeading className="w-[120px]">VISIBILITY</TableHeading>
            <TableHeading className="w-[75px]" last></TableHeading>
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
