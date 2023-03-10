import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeading,
  TableRow,
  HouseIcon,
} from '@/components'
import project from '@/stores/slices/filters/project'
import { useState } from 'react'
import { useGetProjectsQuery } from '../../../api'
import { ProjectsRow, ProjectsRowSkeleton } from '../ProjectsRow'

type ProjectTableProps = {
  onCreate: () => void
  onManage: (id: number) => void
}

export const ProjectsTable = ({ onCreate, onManage }: ProjectTableProps): JSX.Element => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const { data: projects, isLoading } = useGetProjectsQuery()

  const handleExpandedRow = (projectId: number) => {
    setExpandedRow(expandedRow !== projectId ? projectId : null)
  }

  return (
    <TableContainer
      className="min-h-[738px]"
      emptyState={{
        isEmpty: !project?.length && !isLoading,
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
            <TableHeading className="w-[32px]" first></TableHeading>
            <TableHeading className="w-[270px]">NAME</TableHeading>
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
                <ProjectsRow
                  key={project.id}
                  value={project}
                  isExpanded={project.id === expandedRow}
                  onExpand={handleExpandedRow}
                  onManage={onManage}
                />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
