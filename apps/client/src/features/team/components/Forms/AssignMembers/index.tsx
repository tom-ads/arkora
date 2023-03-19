import { Form, FormControl, FormDebouncedInput, HorizontalDivider, MouseIcon } from '@/components'
import { useGetAccountsQuery } from '@/features/account'
import { ReactNode, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
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

const FormWrapper = ({ getValues, setValue }: UseFormReturn<AssignMembersFields>) => {
  const [debouncedSearch, setDebouncedSearch] = useState<string | null>(null)

  const { data: members } = useGetAccountsQuery({
    search: debouncedSearch,
    status: 'INVITE_ACCEPTED',
  })

  const formattedMembers: SelectedAsignee[] = useMemo(() => {
    const selectedItems = getValues('members')
    return (
      members?.map((member) => {
        const isSelected = selectedItems?.find((item) => item.id === member.id)?.isSelected
        return { ...member, isSelected: !!isSelected }
      }) ?? []
    )
  }, [members])

  return (
    <>
      <div className="flex items-center gap-4 mb-5">
        <FormControl>
          <FormDebouncedInput
            name="search"
            placeHolder="Search members"
            size="sm"
            className="!h-[39px]"
            value={debouncedSearch ?? ''}
            onChange={(search) => {
              setValue('search', search)
              setDebouncedSearch(search)
            }}
          />
        </FormControl>
      </div>

      <HorizontalDivider
        contentLeft={
          <p className="whitespace-nowrap font-medium text-base text-gray-100">Members</p>
        }
        contentRight={
          <div className="flex items-center gap-1 text-gray-80">
            <MouseIcon className="w-5 h-5 shrink-0" />
            <p className="whitespace-nowrap text-sm font-medium">Scroll to view list</p>
          </div>
        }
      />

      <AssignMembersList
        value={formattedMembers}
        onChange={(items) => setValue('members', items)}
      />
    </>
  )
}

type AssignMembersFormProps = {
  onSubmit: (data: AssignMembersFields) => void
  children: ReactNode
}

export const AssignMembersForm = ({ onSubmit, children }: AssignMembersFormProps): JSX.Element => {
  return (
    <Form<AssignMembersFields, typeof formSchema>
      onSubmit={onSubmit}
      defaultValues={{ members: [], search: '' }}
    >
      {(methods) => (
        <>
          <FormWrapper {...methods} />
          {children}
        </>
      )}
    </Form>
  )
}
