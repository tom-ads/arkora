import {
  Badge,
  Button,
  FormatCurrency,
  InlineLink,
  SkeletonBox,
  TableData,
  TableRow,
} from '@/components'
import { BillableProgressBar, SpentProgressBar } from '@/components/ProgressBars'
import BudgetType from '@/enums/BudgetType'
import UserRole from '@/enums/UserRole'
import { convertToPounds } from '@/helpers/currency'
import { RootState } from '@/stores/store'
import { Budget } from '@/types'
import { TableRowBaseProps } from '@/types/TableRow'
import Project from '@/types/models/Project'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type RowProps = TableRowBaseProps<Budget & { project?: Project }>

export const BudgetRow = ({ value, onManage }: RowProps): JSX.Element => {
  const { currencyCode, authRole } = useSelector((state: RootState) => ({
    currencyCode: state.organisation.currency?.code,
    authRole: state.auth.user?.role?.name,
  }))

  const handleManage = () => {
    if (onManage) {
      onManage(value.id)
    }
  }

  const formattedBudget = useMemo(() => {
    const transformedBudget = { ...value }
    if (value) {
      transformedBudget.allocatedBudget = convertToPounds(value.allocatedBudget)
      transformedBudget.billableCost = convertToPounds(value.billableCost)
      transformedBudget.unbillableCost = convertToPounds(value.unbillableCost)
      transformedBudget.spentCost = convertToPounds(value.spentCost)
      transformedBudget.remainingCost = convertToPounds(value.remainingCost)
      transformedBudget.hourlyRate = convertToPounds(value.hourlyRate)
    }

    return transformedBudget
  }, [value])

  const showCost = authRole === UserRole.MEMBER ? formattedBudget?.project?.showCost : true

  return (
    <TableRow>
      <TableData>
        <div
          className="w-2 h-9 flex flex-col grow rounded-lg"
          style={{ backgroundColor: value.colour ?? 'black' }}
        ></div>
      </TableData>

      <TableData className="truncate">
        <InlineLink className="font-medium truncate" to={`/budgets/${value.id}`}>
          {value.name}
        </InlineLink>
      </TableData>

      <TableData>
        <Badge variant="default">{value?.budgetType?.name}</Badge>
      </TableData>

      <TableData>
        {value.budgetType?.name !== BudgetType.NON_BILLABLE && value.hourlyRate && showCost ? (
          <FormatCurrency value={formattedBudget?.hourlyRate} currency={currencyCode} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {value.budgetType?.name !== BudgetType.NON_BILLABLE && showCost ? (
          <FormatCurrency value={formattedBudget.allocatedBudget} currency={currencyCode} />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {value.budgetType?.name !== BudgetType.NON_BILLABLE && showCost ? (
          <SpentProgressBar
            width={200}
            billableCost={formattedBudget.billableCost}
            unbillableCost={formattedBudget.unbillableCost}
            allocatedBudget={formattedBudget.allocatedBudget}
            allocatedDuration={formattedBudget.allocatedDuration}
          />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        {value.budgetType?.name !== BudgetType.NON_BILLABLE && showCost ? (
          <BillableProgressBar
            width={200}
            billableTotal={formattedBudget.billableCost}
            unbillableTotal={formattedBudget.unbillableCost}
          />
        ) : (
          <p>- - -</p>
        )}
      </TableData>

      <TableData>
        <p>{value.private ? 'Private' : 'Public'}</p>
      </TableData>

      <TableData>
        {authRole !== UserRole.MEMBER && (
          <Button variant="blank" onClick={handleManage}>
            Manage
          </Button>
        )}
      </TableData>
    </TableRow>
  )
}

export const BudgetSkeletonRow = (): JSX.Element => {
  return (
    <TableRow>
      <TableData>
        <SkeletonBox height={36} width={14} className="rounded-lg" />
      </TableData>

      <TableData>
        <SkeletonBox height={20} randomWidth />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={50} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={50} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={100} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={170} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={170} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={60} />
      </TableData>

      <TableData>
        <SkeletonBox height={20} width={60} />
      </TableData>
    </TableRow>
  )
}
