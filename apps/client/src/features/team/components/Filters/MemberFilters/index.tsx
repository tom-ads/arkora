import { Card, FormControl, FormDebouncedInput, Form, FormSelect, Button } from '@/components'
import { SelectOption } from '@/components/Forms/Select/option'
import UserRole from '@/enums/UserRole'
import { setFilters, TeamMemberStatus } from '@/stores/slices/filters/team_members'
import { RootState } from '@/stores/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

type FilterFormFields = {
  search: string | null
  role: UserRole | null
  status: TeamMemberStatus | null
}

const filtersSchema = z.object({
  search: z.string().nullable().optional(),
  role: z.nativeEnum(UserRole).nullable().optional(),
  status: z.enum(['INVITE_ACCEPTED', 'INVITE_PENDING']).nullable().optional(),
})

const FormWrapper = ({
  watch,
  getValues,
  children,
}: {
  watch: any
  getValues: any
  children: any
}): JSX.Element => {
  const dispatch = useDispatch()

  const [params, setParams] = useSearchParams()

  const { searchFilter, roleFilter, statusFilter } = useSelector((state: RootState) => ({
    searchFilter: state.teamMemberFilters.search,
    roleFilter: state.teamMemberFilters.role,
    statusFilter: state.teamMemberFilters.status,
  }))

  const formattedParams = useMemo(() => {
    return {
      search: searchFilter,
      role: roleFilter,
      status: statusFilter,
    } as FilterFormFields
  }, [searchFilter, roleFilter, statusFilter, params])

  useEffect(() => {
    if (formattedParams) {
      setParams(
        Object.fromEntries(
          Object.entries(formattedParams).filter(([_, value]) => value),
        ) as URLSearchParamsInit,
      )
    }
  }, [formattedParams])

  useEffect(() => {
    dispatch(
      setFilters({
        role: getValues('role'),
        search: getValues('search'),
        status: getValues('status'),
      }),
    )
  }, [watch('role'), watch('search'), watch('status')])

  return children
}

export const MemberFilters = (): JSX.Element => {
  const roleOptions = useMemo(() => {
    return Object.values(UserRole).map((role) => ({
      id: role,
      display: role.toLowerCase()?.replace('_', ' '),
    }))
  }, [])

  const statusOptions = useMemo(() => {
    return ['INVITE_ACCEPTED', 'INVITE_PENDING'].map((status) => ({
      id: status,
      display: status.toLowerCase()?.replace('_', ' '),
    }))
  }, [])

  return (
    <Card>
      <Form<FilterFormFields, typeof filtersSchema>
        className="!flex-row gap-8 justify-between"
        defaultValues={{
          search: null,
          role: null,
          status: null,
        }}
      >
        {({ watch, setValue, getValues, control, reset }) => (
          <FormWrapper watch={watch} getValues={getValues}>
            <FormControl className="max-w-sm">
              <FormDebouncedInput
                name="search"
                placeHolder="Search members"
                value={watch('search') ?? ''}
                onChange={(value) => setValue('search', value)}
              />
            </FormControl>

            <div className="flex gap-4">
              <FormControl className="w-[200px]">
                <FormSelect name="role" control={control} placeHolder="Filter Role" fullWidth>
                  {roleOptions?.map((option) => (
                    <SelectOption key={option.id} id={option.id}>
                      {option?.display}
                    </SelectOption>
                  ))}
                </FormSelect>
              </FormControl>

              <FormControl className="w-[100p] md:w-[200px]">
                <FormSelect name="status" control={control} placeHolder="Filter Status" fullWidth>
                  {statusOptions?.map((option) => (
                    <SelectOption key={option.id} id={option.id}>
                      {option?.display}
                    </SelectOption>
                  ))}
                </FormSelect>
              </FormControl>

              <Button variant="blank" onClick={() => reset()}>
                Clear Filters
              </Button>
            </div>
          </FormWrapper>
        )}
      </Form>
    </Card>
  )
}
