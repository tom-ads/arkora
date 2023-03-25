import {
  Form,
  FormChangeCallback,
  FormControl,
  FormLabel,
  FormTextArea,
  FormTimeInput,
  FormErrorMessage,
} from '@/components'
import { FormGroupSelect } from '@/components/Forms/GroupSelect'
import { GroupOption } from '@/components/Forms/GroupSelect/option'
import { useGetBudgetsQuery } from '../../../../budget/api'
import { Budget, ModalBaseProps } from '@/types'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { ZodType } from 'zod'
import { groupBy, startCase } from 'lodash'
import { useLazyGetTasksQuery } from '@/features/task'
import Task from '@/types/models/Task'
import { UseFormReturn } from 'react-hook-form'

export type TimeEntryFields = {
  budget: number | undefined
  task: number | undefined
  estimatedTime: string
  trackedTime: string
  description: string | undefined
}

type TimeEntryFormProps = ModalBaseProps & {
  onSubmit: (data: TimeEntryFields) => void
  defaultValues: TimeEntryFields
  validationSchema: ZodType
  children: ReactNode
}

export const TimeEntryForm = ({
  isOpen,
  onSubmit,
  defaultValues,
  validationSchema,
  children,
}: TimeEntryFormProps): JSX.Element => {
  const [budgetId, setBudgetId] = useState<number | undefined>(undefined)

  const { data: budgets } = useGetBudgetsQuery({ includeProject: true }, { skip: !isOpen })

  const [triggerTasks, { data: tasks }] = useLazyGetTasksQuery()

  const handleFormChange = useCallback<FormChangeCallback<TimeEntryFields>>(
    (fields: TimeEntryFields, methods: UseFormReturn<TimeEntryFields>) => {
      if (fields?.budget !== budgetId) {
        setBudgetId(fields.budget)
        methods.resetField('task')
      }
    },
    [budgetId, triggerTasks],
  )

  useEffect(() => {
    if (budgetId) {
      triggerTasks({ budgetId })
    }
  }, [budgetId])

  const budgetOptions: Record<string, GroupOption[]> = useMemo(() => {
    const groupedBudgets: Record<string, Budget[]> = groupBy(budgets, (p) => p.project?.name)
    return Object.fromEntries(
      Object.entries(groupedBudgets ?? {}).map(([key, value]) => [
        startCase(key),
        value.map((budget: Budget) => ({
          id: budget.id,
          display: budget.name,
        })),
      ]),
    )
  }, [budgets])

  const taskOptions: Record<string, GroupOption[]> = useMemo(() => {
    const groupedTasks: Record<string, Task[]> = groupBy(tasks, (p) => p.isBillable)
    return Object.fromEntries(
      Object.entries(groupedTasks ?? {}).map(([key, value]) => {
        return [
          key === 'billable' ? 'Billable' : 'Non-Billable',
          value.map((task: Task) => ({
            id: task.id,
            display: task.name,
          })),
        ]
      }),
    )
  }, [tasks])

  return (
    <Form<TimeEntryFields, typeof validationSchema>
      onSubmit={onSubmit}
      className="space-y-6"
      onChange={handleFormChange}
      validationSchema={validationSchema}
      defaultValues={defaultValues}
    >
      {({ control, watch, formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="budget">Budget</FormLabel>
            <FormGroupSelect
              name="budget"
              control={control}
              placeHolder="Select budget"
              error={!!errors?.budget?.message}
              fullWidth
            >
              {Object.entries(budgetOptions)?.map(([groupName, budgets]) => (
                <GroupOption key={groupName} name={groupName} group={budgets} />
              ))}
            </FormGroupSelect>
            {errors?.budget?.message && (
              <FormErrorMessage>{errors.budget?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="task">Task</FormLabel>
            <FormGroupSelect
              name="task"
              control={control}
              placeHolder="Select task"
              disabled={!watch('budget')}
              error={!!errors?.task?.message && !!watch('budget')}
              fullWidth
            >
              {Object.entries(taskOptions)?.map(([groupName, tasks]) => (
                <GroupOption key={groupName} name={groupName} group={tasks} />
              ))}
            </FormGroupSelect>
            {errors?.task?.message && <FormErrorMessage>{errors.task?.message}</FormErrorMessage>}
          </FormControl>

          <div className="flex justify-between gap-8">
            <FormControl>
              <FormLabel htmlFor="estimatedTime">Est. Time</FormLabel>
              <FormTimeInput name="estimatedTime" size="sm" error={!!errors.estimatedTime} />
              {errors?.estimatedTime?.message && (
                <FormErrorMessage>{errors.estimatedTime?.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="trackedTime">Tracked Time</FormLabel>
              <FormTimeInput name="trackedTime" size="sm" error={!!errors.trackedTime} />
              {errors?.trackedTime?.message && (
                <FormErrorMessage>{errors.trackedTime?.message}</FormErrorMessage>
              )}
            </FormControl>
          </div>

          <FormControl>
            <FormLabel htmlFor="description">Description (Optional)</FormLabel>
            <FormTextArea
              name="description"
              size="sm"
              error={!!errors.description}
              placeholder="What are you working on?"
            />
          </FormControl>

          {children}
        </>
      )}
    </Form>
  )
}
