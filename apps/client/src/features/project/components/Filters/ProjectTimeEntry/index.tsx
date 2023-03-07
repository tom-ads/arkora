import { FormControl, FormSelect, Form, Button, FormMultiSelect } from '@/components'
import { SelectOption } from '@/components/Forms/Select/option'
import { useGetAccountsQuery } from '@/features/account'
import { setFilters } from '@/stores/slices/filters/project'
import { RootState } from '@/stores/store'
import { useEffect, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { URLSearchParamsInit, useParams, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

type FormFields = {
  billable: 'billable' | 'unbillable' | null
  users: number[]
}

const formSchema = z.object({
  billable: z.boolean().nullable(),
  users: z.array(z.number()),
})

type FormWrapperProps = UseFormReturn<FormFields> & {
  children: any
}

const FormWrapper = ({ getValues, watch, children }: FormWrapperProps): JSX.Element => {
  const dispatch = useDispatch()

  const [params, setParams] = useSearchParams()

  const { membersFilter, billableFilter } = useSelector((state: RootState) => ({
    membersFilter: state.projectFilters.timeEntry.members,
    billableFilter: state.projectFilters.timeEntry.billable,
  }))

  const formattedParams = useMemo(() => {
    return {
      billable: billableFilter,
    } as FormFields
  }, [billableFilter, params])

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
          members: getValues('users'),
          billable: getValues('billable'),
        },
      }),
    )
  }, [watch('users'), watch('billable')])

  return children
}

export const ProjectTimeEntryFilters = (): JSX.Element => {
  const { projectId } = useParams()

  const { data: projectMembers } = useGetAccountsQuery(
    { projectId: projectId!, status: 'INVITE_ACCEPTED' },
    { skip: !projectId },
  )

  const memberOptions = useMemo(() => {
    return (
      projectMembers?.map((member) => ({
        id: member.id,
        display: `${member.firstname} ${member.lastname}`,
      })) ?? []
    )
  }, [projectMembers])

  const billableOptions = useMemo(() => {
    return [
      { id: 'billable', display: 'Billable' },
      { id: 'unbillable', display: 'Non Billable' },
    ]
  }, [])

  return (
    <Form<FormFields, typeof formSchema>
      className="!flex-row gap-8 justify-between"
      validationSchema={formSchema}
      defaultValues={{
        billable: null,
        users: [],
      }}
    >
      {(methods) => (
        <FormWrapper {...methods}>
          <FormControl className="w-[100p] md:w-[200px]">
            <FormSelect name="billable" placeHolder="Filter billable" control={methods.control}>
              {billableOptions?.map((option) => (
                <SelectOption key={option.id} id={option.id}>
                  {option.display}
                </SelectOption>
              ))}
            </FormSelect>
          </FormControl>

          <div className="flex items-center gap-4">
            <FormControl className="w-[100p] md:w-[250px]">
              <FormMultiSelect
                name="users"
                placeHolder="Filter team"
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

            <FormControl className="w-[100p] md:w-[200px]">
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
          </div>
        </FormWrapper>
      )}
    </Form>
  )
}
