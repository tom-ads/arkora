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
import ProjectStatus from '@/enums/ProjectStatus'
import UserRole from '@/enums/UserRole'
import { RootState } from '@/stores/store'
import ProjectBudget from '@/types/models/ProjectBudget'
import { TableRowBaseProps } from '@/types/TableRow'
import { useSelector } from 'react-redux'

export const ProjectsRow = ({ value, onManage }: TableRowBaseProps<ProjectBudget>): JSX.Element => {
  const authRole = useSelector((state: RootState) => state.auth.user?.role?.name)

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
          {value.status === ProjectStatus.ACTIVE && <Badge variant="success">Active</Badge>}
          {value.status === ProjectStatus.PENDING && <Badge variant="warn">Pending</Badge>}
          {value.status === ProjectStatus.ARCHIVED && <Badge variant="default">Archived</Badge>}
        </TableData>

        <TableData>{value.private ? 'Private' : 'Public'}</TableData>

        <TableData>
          {authRole !== UserRole.MEMBER && (
            <Button variant="blank" onClick={handleManage}>
              Manage
            </Button>
          )}
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
