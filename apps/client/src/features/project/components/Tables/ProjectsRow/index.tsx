import {
  Table,
  TableHead,
  TableHeading,
  TableRow,
  TableData,
  InlineLink,
  ChevronIcon,
  Badge,
  AvatarLimit,
  Button,
  SkeletonBox,
} from '@/components'
import { SkeletonCircle } from '@/components/Skeletons/Circle'
import { ExpandableRow } from '@/components/Table/ExpandableRow'
import Status from '@/enums/Status'
import ProjectBudget from '@/types/models/ProjectBudget'
import { TableRowBaseProps } from '@/types/TableRow'
import classNames from 'classnames'

type RowProps = TableRowBaseProps<ProjectBudget> & {
  isExpanded: boolean
  onExpand: (id: number) => void
}

export const ProjectsRow = ({ value, isExpanded, onExpand, onManage }: RowProps): JSX.Element => {
  const handleManage = () => {
    if (onManage) {
      onManage(value.id)
    }
  }

  return (
    <>
      <TableRow>
        <TableData>
          <Button variant="blank" onClick={() => onExpand(value.id)}>
            <ChevronIcon
              className={classNames(
                'w-5 h-5 transition-transform duration-150 transform text-gray-90',
                { '-rotate-90': !isExpanded },
              )}
            />
          </Button>
        </TableData>

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

      {/* Project Budgets Expandable */}
      <ExpandableRow show={isExpanded}>
        <TableData colSpan={6}>
          <Table>
            <TableHead>
              <TableHeading className="w-[255px]" first>
                Budget
              </TableHeading>
              <TableHeading className="w-[255px]">Type</TableHeading>
              <TableHeading className="w-[255px]">Rate</TableHeading>
              <TableHeading className="w-[255px]">Alloc. Hours</TableHeading>
              <TableHeading className="w-[255px]">Spent / Remaining</TableHeading>
              <TableHeading className="w-[255px]" last>
                Billable / Non-Billable
              </TableHeading>
            </TableHead>
          </Table>
        </TableData>
      </ExpandableRow>
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
