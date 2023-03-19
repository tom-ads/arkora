import { Form, FormControl, FormDebouncedInput, HorizontalDivider } from '@/components'
import { User } from '@/types'
import { ReactNode } from 'react'
import { z } from 'zod'
import { AssignMembersList } from '../../Lists/AssignMembers'
import { SelectedAsignee } from './../../../types'

export type AssignMembersFields = {
  search: string
  members: SelectedAsignee[]
}

const formSchema = z.object({
  search: z.string(),
  members: z.array(z.number()),
})

type AssignMembersFormProps = {
  onSubmit: (data: AssignMembersFields) => void
  onSearch: (search: string) => void
  value: User[]
  children: ReactNode
}

export const AssignMembersForm = ({
  value,
  onSearch,
  onSubmit,
  children,
}: AssignMembersFormProps): JSX.Element => {
  return (
    <Form<AssignMembersFields, typeof formSchema>
      onSubmit={onSubmit}
      defaultValues={{ members: [], search: '' }}
    >
      {({ setValue, watch }) => (
        <>
          <FormControl className="mb-5">
            <FormDebouncedInput
              name="search"
              placeHolder="Search members"
              size="sm"
              className="!h-[39px]"
              value={watch('search')}
              onChange={(search) => {
                setValue('search', search)
                onSearch(search)
              }}
            />
          </FormControl>

          <HorizontalDivider
            contentLeft={
              <p className="whitespace-nowrap font-medium text-base text-gray-100">Members</p>
            }
            contentRight={
              <p className="whitespace-nowrap font-medium text-base text-gray-100">
                {watch('members')?.length ?? 0} Selected
              </p>
            }
          />

          <AssignMembersList
            items={value}
            selected={watch('members')}
            onChange={(items) => setValue('members', items)}
          />

          {children}
        </>
      )}
    </Form>
  )
}
