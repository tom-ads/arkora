import { Avatar, CircleTick, UserIcon } from '@/components'
import { SelectedAsignee } from './../../../types'
import classNames from 'classnames'
import { User } from '@/types'

type AssignMembersListProps = {
  items: User[]
  selected: SelectedAsignee[]
  onChange: (items: SelectedAsignee[]) => void
}

export const AssignMembersList = ({
  items,
  selected,
  onChange,
}: AssignMembersListProps): JSX.Element => {
  const handleOnClick = (selectedAssignee: SelectedAsignee) => {
    const isSelected = selected?.find((item) => item.id === selectedAssignee.id)?.isSelected
    if (isSelected) {
      onChange(selected.filter((member) => member.id !== selectedAssignee.id))
      return
    }

    onChange([...selected, { ...selectedAssignee, isSelected: true }])
  }

  const formattedMembers: SelectedAsignee[] = items?.map((member) => {
    const isSelected = selected?.find((item) => item.id === member.id)?.isSelected
    return { ...member, isSelected: !!isSelected }
  })

  if (!formattedMembers?.length) {
    return (
      <div className="py-5 w-full text-center h-[400px]">
        <p className="font-medium text-md text-gray-50 whitespace-nowrap">All Members Assigned</p>
      </div>
    )
  }

  return (
    <ul className="w-full py-4 h-[400px] overflow-y-auto scrollbar-hide divide-y divide-dashed divide-gray-30 scroll-smooth">
      {formattedMembers?.map((member) => (
        <li key={member.id} className="w-full">
          <div className="my-1">
            <button
              type="button"
              onClick={() => handleOnClick(member)}
              className={classNames(
                'w-full justify-between flex items-center px-4 py-2 group rounded focus:outline-none transition-colors',
                {
                  'bg-purple-10 text-purple-90 focus-visible:bg-purple-10': member?.isSelected,
                  'bg-white hover:bg-gray-10 focus-visible:bg-gray-10': !member?.isSelected,
                },
              )}
            >
              <div className="flex items-center gap-5">
                <Avatar
                  className={classNames('w-9 h-9 transition-colors', {
                    'bg-purple-20': member?.isSelected,
                    'bg-purple-10': !member?.isSelected,
                  })}
                >
                  {member.initials || <UserIcon className="w-4 h-4 text-purple-90" />}
                </Avatar>
                <div className="flex flex-col items-start">
                  <p
                    className={classNames('font-semibold text-[13px] transition-colors', {
                      'text-purple-90': member?.isSelected,
                      'text-gray-100': !member?.isSelected,
                    })}
                  >
                    {member?.firstname} {member?.lastname ?? ''}
                  </p>
                  <span
                    className={classNames('font-medium text-xs transition-colors', {
                      'text-purple-90': member?.isSelected,
                      'text-gray-60': !member?.isSelected,
                    })}
                  >
                    {member?.email?.toLowerCase()}
                  </span>
                </div>
              </div>

              {member?.isSelected && (
                <span className="w-4 h-4 shrink-0 mr-1" aria-hidden>
                  <CircleTick aria-hidden />
                </span>
              )}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
