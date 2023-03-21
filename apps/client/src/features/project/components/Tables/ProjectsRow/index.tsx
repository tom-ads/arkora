import {
  TableRow,
  TableData,
  InlineLink,
  Badge,
  AvatarLimit,
  Button,
  SkeletonBox,
} from '@/components'
import { SkeletonCircle } from '@/components/Skeletons/Circle'
import Status from '@/enums/Status'
import ProjectBudget from '@/types/models/ProjectBudget'
import { TableRowBaseProps } from '@/types/TableRow'

export const ProjectsRow = ({ value, onManage }: TableRowBaseProps<ProjectBudget>): JSX.Element => {
  const handleManage = () => {
    if (onManage) {
      onManage(value.id)
    }
  }

  return (
    <>
      <TableRow>
        <TableData className="truncate">
          <InlineLink className="font-medium" to={`/projects/${value.id}`}>
            {value.name}
          </InlineLink>
        </TableData>

        <TableData>{value.client.name}</TableData>

        <TableData>
          <AvatarLimit
            values={value.members?.map((member) => ({
              id: member.id,
              value: member.initials,
            }))}
          />
        </TableData>

        <TableData>
          {value.status === Status.ACTIVE && <Badge variant="success">Active</Badge>}
          {value.status === Status.INACTIVE && <Badge variant="warn">Inactive</Badge>}
        </TableData>

        <TableData>{value.private ? 'Private' : 'Public'}</TableData>

        <TableData>
          <Button variant="blank" onClick={handleManage}>
            Manage
          </Button>
        </TableData>
      </TableRow>
    </>
  )
}

export const ProjectsRowSkeleton = (): JSX.Element => {
  return (
    <>
      <TableRow>
        <TableData>
          <SkeletonBox width={20} height={20} />
        </TableData>

        <TableData>
          <SkeletonBox height={20} randomWidth />
        </TableData>

        <TableData>
          <SkeletonBox height={20} randomWidth />
        </TableData>

        <TableData>
          <div className="flex items-center gap-1">
            <SkeletonCircle height={32} width={32} />
            <SkeletonCircle height={32} width={32} />
            <SkeletonCircle height={32} width={32} />
          </div>
        </TableData>

        <TableData>
          <SkeletonBox height={20} width={80} />
        </TableData>

        <TableData>
          <SkeletonBox height={20} width={80} />
        </TableData>

        <TableData>
          <SkeletonBox height={20} width={50} />
        </TableData>
      </TableRow>
    </>
  )
}
