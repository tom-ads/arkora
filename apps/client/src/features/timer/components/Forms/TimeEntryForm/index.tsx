import {
  Form,
  FormControl,
  FormLabel,
  FormTextArea,
  FormTimeInput,
  FormErrorMessage,
  DoubleCashIcon,
  ClipboardIcon,
} from '@/components'
import { FormGroupSelect, FormGroupSelectEmptyState } from '@/components/Forms/GroupSelect'
import { GroupOption } from '@/components/Forms/GroupSelect/option'
import { useGetBudgetsQuery } from '../../../../budget/api'
import { Budget, ModalBaseProps } from '@/types'
import { ReactNode, useMemo } from 'react'
import { ZodType } from 'zod'
import { groupBy, startCase } from 'lodash'
import Task from '@/types/models/Task'
import { UseFormReturn } from 'react-hook-form'
import { useGetBudgetTasksQuery } from '@/features/budget_tasks'
import ProjectStatus from '@/enums/ProjectStatus'

export type TimeEntryFields = {
  budget: number | undefined
  task: number | undefined
  estimatedTime: string
  trackedTime: string
  description: string | undefined
}

type TimeEntryFormProps = ModalBaseProps & {
  activeProject?: boolean
  onSubmit: (data: TimeEntryFields) => void
  defaultValues: TimeEntryFields
  validationSchema: ZodType
  children: ReactNode
}

type FormWrapperProps = UseFormReturn<TimeEntryFields> & {
  children: any
  activeProject?: boolean
}

const FormWrapper = ({
  activeProject,
  formState,
  control,
  watch,
  setValue,
  children,
}: FormWrapperProps) => {
  const { data: budgets } = useGetBudgetsQuery({
    ...(activeProject && { projectStatus: ProjectStatus.ACTIVE }),
    includeProject: true,
  })

  const { data: tasks } = useGetBudgetTasksQuery(watch('budget')!, {
    skip: !watch('budget'),
  })

  const handleBudget = () => {
    setValue('task', undefined)
  }

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
          key === 'true' ? 'Billable' : 'Non-Billable',
          value.map((task: Task) => ({
            id: task.id,
            display: task.name,
          })),
        ]
      }),
    )
  }, [tasks])

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="budget">Budget</FormLabel>
        <FormGroupSelect
          name="budget"
          control={control}
          placeHolder="Select budget"
          onChange={handleBudget}
          error={!!formState?.errors?.budget?.message}
          emptyState={
            <FormGroupSelectEmptyState
              icon={<DoubleCashIcon />}
              title="No Budgets"
              description="You are not assigned to any project budgets"
            />
          }
          fullWidth
        >
          {Object.entries(budgetOptions)?.map(([groupName, budgets]) => (
            <GroupOption key={groupName} name={groupName} group={budgets} />
          ))}
        </FormGroupSelect>
        {formState?.errors?.budget?.message && (
          <FormErrorMessage>{formState?.errors?.budget?.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="task">Task</FormLabel>
        <FormGroupSelect
          name="task"
          control={control}
          placeHolder="Select task"
          disabled={!watch('budget')}
          error={!!formState?.errors?.task?.message && !!watch('budget')}
          emptyState={
            <FormGroupSelectEmptyState
              icon={<ClipboardIcon />}
              title="No Budget Tasks"
              description="The selected budget has no tasks to track against"
            />
          }
          fullWidth
        >
          {Object.entries(taskOptions)?.map(([groupName, tasks]) => (
            <GroupOption key={groupName} name={groupName} group={tasks} />
          ))}
        </FormGroupSelect>
        {formState?.errors?.task?.message && (
          <FormErrorMessage>{formState?.errors.task?.message}</FormErrorMessage>
        )}
      </FormControl>

      <div className="flex justify-between gap-8">
        <FormControl>
          <FormLabel htmlFor="estimatedTime">Est. Time (Optional)</FormLabel>
          <FormTimeInput name="estimatedTime" size="sm" error={!!formState?.errors.estimatedTime} />
          {formState?.errors?.estimatedTime?.message && (
            <FormErrorMessage>{formState?.errors.estimatedTime?.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="trackedTime">Tracked Time</FormLabel>
          <FormTimeInput name="trackedTime" size="sm" error={!!formState?.errors.trackedTime} />
          {formState?.errors?.trackedTime?.message && (
            <FormErrorMessage>{formState?.errors.trackedTime?.message}</FormErrorMessage>
          )}
        </FormControl>
      </div>

      <FormControl>
        <FormLabel htmlFor="description">Description (Optional)</FormLabel>
        <FormTextArea
          name="description"
          size="sm"
          error={!!formState?.errors.description}
          placeholder="What are you working on?"
        />
      </FormControl>

      {children}
    </>
  )
}

export const TimeEntryForm = ({
  onSubmit,
  defaultValues,
  validationSchema,
  activeProject,
  children,
}: TimeEntryFormProps): JSX.Element => {
  return (
    <Form<TimeEntryFields, typeof validationSchema>
      onSubmit={onSubmit}
      className="space-y-6"
      validationSchema={validationSchema}
      defaultValues={defaultValues}
    >
      {(methods) => (
        <FormWrapper {...methods} activeProject={activeProject}>
          {children}
        </FormWrapper>
      )}
    </Form>
  )
}
