import { Avatar, BinIcon, Button, FormControl, FormSelect, List, UserIcon } from '@/components'
import { SelectOption } from '@/components/Forms/Select/option'
import UserRole from '@/enums/UserRole'
import { InviteFormFields } from '../../../types'
import { useMemo } from 'react'

export const InviteMemberList = ({ watch, control }: { watch: any; control: any }): JSX.Element => {
  const roleOptions = useMemo(
    () =>
      Object.values(UserRole)
        .filter((r) => r !== UserRole.OWNER)
        .map((role) => ({
          id: role,
          display: role.toLowerCase()?.replace('_', ' '),
        })),
    [],
  )

  if (!watch('members')?.length) {
    return (
      <div className="py-5 w-full text-center min-h-[169px]">
        <p className="font-medium text-md text-gray-50 whitespace-nowrap">No Member Invites</p>
      </div>
    )
  }

  return (
    <List<InviteFormFields, 'members'>
      name="members"
      control={control}
      listClassName="h-[250px] overflow-y-auto scrollbar-hide scroll-smooth snap-y"
      itemClassName="border border-gray-40 rounded px-4 py-2 w-full flex items-center justify-between"
    >
      {({ field, itemIdx, methods }) => (
        <>
          <div className="flex items-center">
            <Avatar className="w-7 h-7 mr-3">
              <UserIcon className="w-4 h-4" />
            </Avatar>
            <p className="text-gray-80 text-sm font-medium truncate max-w-[250px]">{field.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <FormControl className="w-[135px]">
              <FormSelect
                name={`members.${itemIdx}.role`}
                control={control}
                placeHolder="Select role"
                size="xs"
              >
                {roleOptions?.map((option) => (
                  <SelectOption key={option.id} id={option.id}>
                    {option?.display}
                  </SelectOption>
                ))}
              </FormSelect>
            </FormControl>
            <Button variant="blank" onClick={() => methods?.remove(itemIdx)}>
              <BinIcon className="w-5 text-red-90 hover:text-red-40 focus:text-red-90 focus-visible:text-red-40" />
            </Button>
          </div>
        </>
      )}
    </List>
  )
}
