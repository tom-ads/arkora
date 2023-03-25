import {
  Button,
  DoubleProgressLineIndicator,
  FormCheckbox,
  TableData,
  TableRow,
  ToolTip,
} from '@/components'
import { calculatePercentage } from '@/helpers/currency'
import { formatMinutesToHourMinutes } from '@/helpers/date'
import Task from '@/types/models/Task'

type TasksRowProps = {
  value: Task
  itemIdx: number
}

export const TasksRow = ({ value, itemIdx }: TasksRowProps): JSX.Element => {
  return (
    <TableRow>
      <TableData>
        <span>{value.name}</span>
      </TableData>

      <TableData>
        {formatMinutesToHourMinutes(value.billableDuration + value.unbillableDuration)}
      </TableData>

      <TableData>
        <ToolTip
          width={262}
          trigger={
            <DoubleProgressLineIndicator
              leftPercent={calculatePercentage(
                value.billableDuration,
                value.billableDuration + value.unbillableDuration,
              )}
              rightPercent={calculatePercentage(
                value.unbillableDuration,
                value.billableDuration + value.unbillableDuration,
              )}
            />
          }
        >
          <div className="divide-y divide-gray-40 divide-dashed">
            <div className="flex justify-between items-center py-1">
              <p className="font-medium text-xs text-green-90">Billable</p>
              <p className="font-semibold text-xs text-gray-80">
                {formatMinutesToHourMinutes(value.billableDuration)}
              </p>
            </div>
            <div className="flex justify-between items-center py-1">
              <p className="font-medium text-xs text-red-90">Non-Billable</p>
              <p className="font-semibold text-xs text-gray-80">
                {formatMinutesToHourMinutes(value.unbillableDuration)}
              </p>
            </div>
          </div>
        </ToolTip>
      </TableData>

      <TableData>
        <FormCheckbox name={`tasks.${itemIdx}.isBillable`} />
      </TableData>

      <TableData>
        <Button
          variant="blank"
          // onClick={() => onDelete(formattedMember.id)}
          // disabled={!isPrivate}
          danger
        >
          Remove
        </Button>
      </TableData>
    </TableRow>
  )
}
