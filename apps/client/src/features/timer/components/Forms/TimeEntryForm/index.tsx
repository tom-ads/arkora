import {
  Form,
  FormControl,
  FormLabel,
  FormTextArea,
  FormTimeTrackingInput,
  TimeEntryResult,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { FormGroupSelect } from '@/components/Forms/GroupSelect'
import { GroupOption } from '@/components/Forms/GroupSelect/option'
import { useGetBudgetsQuery } from '../../../../budget/api'
import { Budget, ModalBaseProps } from '@/types'
import { ReactNode, useMemo, useState } from 'react'
import { z } from 'zod'
import { startCase } from 'lodash'
import { useLazyGetTasksQuery } from '@/features/task'
import Task from '@/types/Task'
import { useCreateTimerMutation } from '../../../api'
import { DateTime } from 'luxon'
import { useToast } from '@/hooks/useToast'

export type TimeEntryFields = {
  budget: {
    id: number | undefined
    value: string | undefined
    children: string | undefined
  }
  task: {
    id: number | undefined
    value: string | undefined
    children: string | undefined
  }
  est_time: TimeEntryResult
  tracked_time: TimeEntryResult
  description: string
}

export const timeEntrySchema = z.object({
  budget: z.object({
    id: z.number(),
    value: z.string({ required_error: 'Budget is required' }),
  }),
  task: z.object({
    id: z.number(),
    value: z.string({ required_error: 'Task is required' }),
  }),
  est_time: z.object({
    durationMinutes: z.number(),
  }),
  tracked_time: z.object({
    durationMinutes: z.number(),
  }),
  description: z.string().optional(),
})

type TimeEntryFormProps = ModalBaseProps & {
  children: ReactNode
}

export const TimeEntryForm = ({ isOpen, onClose, children }: TimeEntryFormProps): JSX.Element => {
  const { errorToast } = useToast()

  const [budgetId, setBudgetId] = useState<number | undefined>(undefined)

  const [createTimer] = useCreateTimerMutation()

  const { data: budgets } = useGetBudgetsQuery(
    {
      group_by: 'PROJECT',
    },
    { skip: !isOpen },
  )

  const [triggerTasks, { data: tasks }] = useLazyGetTasksQuery()

  const onSubmit = async (data: TimeEntryFields) => {
    if (data?.budget?.id && data?.task?.id) {
      await createTimer({
        date: DateTime.now().toSQLDate(),
        budget_id: data.budget.id,
        task_id: data.task.id,
        description: data.description,
        duration_minutes: data.tracked_time.durationMinutes,
        estimated_minutes: data.est_time.durationMinutes,
      })
        .then((data) => {
          onClose()
          /* Save into redux */
        })
        .catch(() => errorToast('Unable to start timer, please contact your administrator'))
    }
  }

  const handleFormChange = (data: TimeEntryFields) => {
    // Only trigger task when budgetId changes
    if (data?.budget?.id !== budgetId) {
      triggerTasks({ budget_id: data.budget.id, group_by: 'BILLABLE' })
      setBudgetId(data.budget.id)
    }
  }

  const budgetOptions: Record<string, GroupOption[]> = useMemo(() => {
    if (!budgets) {
      return {}
    }

    return Object.fromEntries(
      Object.entries(budgets).map(([key, value]) => [
        startCase(key),
        value.map((budget: Budget) => ({
          id: budget.id,
          value: budget.name,
          display: budget.name,
        })),
      ]),
    )
  }, [budgets])

  const taskOptions: Record<string, GroupOption[]> = useMemo(() => {
    if (!tasks) {
      return {}
    }

    return Object.fromEntries(
      Object.entries(tasks).map(([key, value]) => {
        return [
          startCase(key),
          value.map((task: Task) => ({
            id: task.id,
            value: task.name,
            display: task.name,
          })),
        ]
      }),
    )
  }, [tasks])

  return (
    <Form<TimeEntryFields, typeof timeEntrySchema>
      onSubmit={onSubmit}
      className="space-y-6"
      onChange={handleFormChange}
      defaultValues={{
        budget: {
          id: undefined,
          value: undefined,
          children: undefined,
        },
        task: {
          id: undefined,
          value: undefined,
          children: undefined,
        },
        est_time: {
          original: '00:00',
          durationMinutes: 0,
        },
        tracked_time: {
          original: '00:00',
          durationMinutes: 0,
        },
      }}
      validationSchema={timeEntrySchema}
    >
      {({ control, watch, formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="budget">Budget</FormLabel>
            <FormGroupSelect
              name="budget"
              control={control}
              placeHolder="Select budget"
              error={!!errors?.budget?.value?.message}
              fullWidth
            >
              {Object.entries(budgetOptions)?.map(([groupName, budgets]) => (
                <GroupOption key={groupName} name={groupName} group={budgets} />
              ))}
            </FormGroupSelect>
            {errors?.budget?.value?.message && (
              <FormErrorMessage>{errors.budget.value?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="task">Task</FormLabel>
            <FormGroupSelect
              name="task"
              control={control}
              placeHolder="Select task"
              disabled={!watch('budget.id')}
              error={!!errors?.task?.value?.message}
              fullWidth
            >
              {Object.entries(taskOptions)?.map(([groupName, tasks]) => (
                <GroupOption key={groupName} name={groupName} group={tasks} />
              ))}
            </FormGroupSelect>
            {errors?.task?.value?.message && (
              <FormErrorMessage>{errors.task.value?.message}</FormErrorMessage>
            )}
          </FormControl>

          <div className="flex justify-between">
            <FormControl className="max-w-[200px]">
              <FormLabel htmlFor="est_time">Est. Time</FormLabel>
              <FormTimeTrackingInput
                name="est_time"
                control={control}
                size="sm"
                error={!!errors.est_time}
              />
            </FormControl>

            <FormControl className="max-w-[260px]">
              <FormLabel htmlFor="tracked_time">Tracked Time</FormLabel>
              <FormTimeTrackingInput
                name="tracked_time"
                control={control}
                size="sm"
                error={!!errors.tracked_time}
              />
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
