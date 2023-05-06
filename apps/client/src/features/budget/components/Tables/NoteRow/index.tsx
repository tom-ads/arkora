import {
  Avatar,
  Button,
  FormatDateTime,
  SkeletonBox,
  TableData,
  TableRow,
  UserIcon,
} from '@/components'
import { SkeletonCircle } from '@/components/Skeletons/Circle'
import { BudgetNote } from '@/types/models/BugetNote'
import { DateTime } from 'luxon'

type NoteRowProps = {
  onManage: (id: number) => void
  value: BudgetNote
}

export const BudgetNoteRow = ({ onManage, value }: NoteRowProps): JSX.Element => {
  return (
    <TableRow key={value.id}>
      <TableData>
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 uppercase">
            {value?.user?.initials || <UserIcon className="w-5 h-5" />}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-80">
              {value?.user?.firstname} {value?.user?.lastname}
            </span>
          </div>
        </div>
      </TableData>

      <TableData>
        <span className="whitespace-pre-line">{value.note}</span>
      </TableData>

      <TableData>
        <FormatDateTime value={value.createdAt} format={DateTime.DATE_MED} />
      </TableData>

      <TableData>
        <div className="w-full flex items-center justify-end">
          <Button variant="blank" onClick={() => onManage(value.id)}>
            Manage
          </Button>
        </div>
      </TableData>
    </TableRow>
  )
}

export const BudgetNotesSkeletonRow = (): JSX.Element => {
  return (
    <>
      <TableRow>
        <TableData>
          <div className="flex items-center gap-2">
            <SkeletonCircle height={32} width={32} />
            <SkeletonBox height={20} randomWidth />
          </div>
        </TableData>

        <TableData>
          <SkeletonBox height={20} randomWidth />
        </TableData>

        <TableData>
          <SkeletonBox height={20} width={130} />
        </TableData>

        <TableData>
          <SkeletonBox height={20} width={110} />
        </TableData>
      </TableRow>
    </>
  )
}
