import { FormControl, FormSelect, Form, Button, FormMultiSelect } from '@/components'
import { SelectOption } from '@/components/Forms/Select/option'
import { useGetAccountsQuery } from '@/features/account'
import { useGetBudgetsQuery } from '@/features/budget'
import { useGetTimeEntriesQuery } from '@/features/entry'
import { setFilters } from '@/stores/slices/filters/project'
import { RootState } from '@/stores/store'
import { uniqBy } from 'lodash'
import { useEffect, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { URLSearchParamsInit, useParams, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

type FormFields = {
  billable: 'billable' | 'unbillable' | null
  users: number[]
  budgets: number[]
  tasks: number[]
}

const formSchema = z.object({
  billable: z.boolean().nullable(),
  users: z.array(z.number()),
  budgets: z.array(z.number()),
  tasks: z.array(z.number()),
})

type FormWrapperProps = UseFormReturn<FormFields> & {
  children: any
}

const FormWrapper = ({ getValues, watch, children }: FormWrapperProps): JSX.Element => {
  const dispatch = useDispatch()

  const [params, setParams] = useSearchParams()

  const { billableFilter } = useSelector((state: RootState) => ({
    billableFilter: state.projectFilters.timeEntry.billable,
  }))

  const formattedParams = useMemo(
    () => ({
      billable: billableFilter,
    }),
    [billableFilter, params],
  )

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
        timeEntry: {
          tasks: getValues('tasks'),
          members: getValues('users'),
          budgets: getValues('budgets'),
          billable: getValues('billable'),
        },
      }),
    )
  }, [watch('tasks'), watch('users'), watch('budgets'), watch('billable')])

  return children
}

export const ProjectTimeEntryFilters = (): JSX.Element => {
  const { projectId } = useParams()

  const { data: timeEntries } = useGetTimeEntriesQuery({ projectId }, { skip: !projectId })

  const { data: projectMembers } = useGetAccountsQuery(
    { projectId: projectId!, status: 'INVITE_ACCEPTED' },
    { skip: !projectId },
  )

  const { data: projectBudgets } = useGetBudgetsQuery({ projectId }, { skip: !projectId })

  const memberOptions = useMemo(() => {
    return (
      projectMembers?.map((member) => ({
        id: member.id,
        display: `${member.firstname} ${member.lastname}`,
      })) ?? []
    )
  }, [projectMembers])

  const budgetOptions = useMemo(() => {
    return (
      projectBudgets?.map((budget) => ({
        id: budget.id,
        display: budget.name,
      })) ?? []
    )
  }, [projectBudgets])

  const billableOptions = useMemo(() => {
    return [
      { id: 'billable', display: 'Billable' },
      { id: 'unbillable', display: 'Non Billable' },
    ]
  }, [])

  const tasksOptions = useMemo(() => {
    return uniqBy(
      timeEntries?.map((entry) => ({
        id: entry.task.id,
        display: entry.task.name,
      })) ?? [],
      'id',
    )
  }, [timeEntries])

  return (
    <Form<FormFields, typeof formSchema>
      className="!flex-row gap-3 justify-end"
      validationSchema={formSchema}
      defaultValues={{
        billable: null,
        users: [],
        budgets: [],
        tasks: [],
      }}
    >
      {(methods) => (
        <FormWrapper {...methods}>
          <FormControl className="w-[150px] lg:w-[200px]">
            <FormMultiSelect
              name="budgets"
              placeHolder="Filter budgets"
              holderTxt="Budgets"
              control={methods.control}
            >
              {budgetOptions?.map((option) => (
                <SelectOption key={option.id} id={option.id}>
                  {option.display}
                </SelectOption>
              ))}
            </FormMultiSelect>
          </FormControl>

          <FormControl className="w-[150px] lg:w-[200px]">
            <FormMultiSelect
              name="users"
              placeHolder="Filter members"
              holderTxt="Members"
              control={methods.control}
            >
              {memberOptions?.map((option) => (
                <SelectOption key={option.id} id={option.id}>
                  {option.display}
                </SelectOption>
              ))}
            </FormMultiSelect>
          </FormControl>

          <FormControl className="w-[150px] lg:w-[180px]">
            <FormMultiSelect
              name="tasks"
              placeHolder="Filter tasks"
              holderTxt="Tasks"
              control={methods.control}
            >
              {tasksOptions?.map((option) => (
                <SelectOption key={option.id} id={option.id}>
                  {option.display}
                </SelectOption>
              ))}
            </FormMultiSelect>
          </FormControl>

          <FormControl className="w-[145px] lg:w-[165px]">
            <FormSelect name="billable" placeHolder="Filter billable" control={methods.control}>
              {billableOptions?.map((option) => (
                <SelectOption key={option.id} id={option.id}>
                  {option.display}
                </SelectOption>
              ))}
            </FormSelect>
          </FormControl>

          <Button variant="blank" onClick={() => methods.reset()}>
            Clear Filters
          </Button>
        </FormWrapper>
      )}
    </Form>
  )
}
