import { Button, ClockIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { ModalBaseProps } from '@/types'
import { TimeEntryFields, TimeEntryForm } from '../../Forms'
import { useToast } from '@/hooks/useToast'
import { ConfirmationModal } from '@/components/Modals'
import { useState } from 'react'
import {
  useDeleteTimeEntryMutation,
  useGetTimeEntryQuery,
  useUpdateTimeEntryMutation,
} from '@/features/entry'
import { z } from 'zod'
import { convertTimeToMinutes, formatMinutesToTime } from '@/helpers/date'

export const manageEntrySchema = z.object({
  budget: z.number({ required_error: 'Budget is required' }),
  task: z.number({ required_error: 'Task is required' }),
  estimatedTime: z.string().nullable(),
  trackedTime: z.string().superRefine((val, ctx) => {
    const durationMinutes = convertTimeToMinutes(val)
    if (!durationMinutes || durationMinutes <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tracked time required',
      })
    }
  }),
  description: z.string().nullable(),
})

type ManageTimeEntryModalProps = ModalBaseProps & {
  activeProject?: boolean
  entryId: number | null
}

export const ManageTimeEntryModal = ({
  entryId,
  activeProject,
  isOpen,
  onClose,
}: ManageTimeEntryModalProps): JSX.Element => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { successToast, errorToast } = useToast()

  const { data: entry } = useGetTimeEntryQuery(entryId!, { skip: !entryId })

  const [triggerUpdate, { isLoading: updatingEntry }] = useUpdateTimeEntryMutation()

  const [triggerDelete, { isLoading: deletingEntry }] = useDeleteTimeEntryMutation()

  const onSubmit = async (data: TimeEntryFields) => {
    if (data.budget && data.task) {
      await triggerUpdate({
        timer_id: entry!.id,
        date: entry!.date,
        budget_id: data.budget,
        task_id: data!.task,
        description: data.description ?? '',
        duration_minutes: convertTimeToMinutes(data.trackedTime),
        estimated_minutes: convertTimeToMinutes(data.estimatedTime),
      })
        .unwrap()
        .then(() => successToast('Entry has been updated'))
        .catch((error) => {
          if (error.status === 422) return
          errorToast('Unable to update entry, please try again later.')
        })

      onClose()
    }
  }

  const onConfirm = async () => {
    setOpenConfirmationModal(false)

    await triggerDelete(entryId!)
      .unwrap()
      .then(() => successToast('Entry has been removed'))
      .catch(() => errorToast('Unable to remove entry, please try again later.'))

    onClose()
  }

  return (
    <>
      <Modal
        title="Manage Entry"
        description="Update time entry information"
        icon={<ClockIcon />}
        isOpen={isOpen}
        onClose={onClose}
      >
        <TimeEntryForm
          activeProject={activeProject}
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={onSubmit}
          validationSchema={manageEntrySchema}
          defaultValues={{
            budget: entry?.budgetId ?? undefined,
            task: entry?.taskId ?? undefined,
            description: entry?.description ?? '',
            estimatedTime: entry?.estimatedMinutes
              ? formatMinutesToTime(entry?.estimatedMinutes)
              : '',
            trackedTime: entry?.durationMinutes ? formatMinutesToTime(entry?.durationMinutes) : '',
          }}
        >
          <ModalFooter className="!mt-11">
            <Button
              variant="blank"
              onClick={() => setOpenConfirmationModal(true)}
              disabled={updatingEntry}
              danger
            >
              Delete
            </Button>
            <Button size="xs" type="submit" className="max-w-[161px]" loading={updatingEntry}>
              <span>Update Entry</span>
            </Button>
          </ModalFooter>
        </TimeEntryForm>
      </Modal>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={onConfirm}
        loading={deletingEntry}
        title="You're about to remove a time entry"
        btnText="Delete Entry"
        description="Performing this action will permanently remove the tracked time for this entry. It cannot be recovered."
      />
    </>
  )
}
