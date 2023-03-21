import { Button, ClockIcon, PlayIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useCreateTimerMutation } from '../../../api'
import { ModalBaseProps } from '@/types'
import { TimeEntryFields, TimeEntryForm } from '../../Forms/TimeEntryForm'
import { DateTime } from 'luxon'
import { useDispatch } from 'react-redux'
import { useToast } from '@/hooks/useToast'
import { startTracking } from '@/stores/slices/timer'
import { z } from 'zod'
import { convertTimeToMinutes } from '@/helpers/date'

export const newEntrySchema = z.object({
  budget: z.number({ required_error: 'Budget is required' }),
  task: z.number({ required_error: 'Task is required' }),
  estimatedTime: z.string().nullable(),
  trackedTime: z.string().nullable(),
  description: z.string().optional(),
})

export const NewTimeEntryModal = ({ isOpen, onClose }: ModalBaseProps): JSX.Element => {
  const dispatch = useDispatch()

  const { errorToast } = useToast()

  const [createTimer, { isLoading: creatingTimer }] = useCreateTimerMutation()

  const onSubmit = async (data: TimeEntryFields) => {
    if (data?.budget && data?.task) {
      await createTimer({
        date: DateTime.now().toSQLDate(),
        budget_id: data.budget,
        task_id: data.task,
        description: data.description,
        duration_minutes: convertTimeToMinutes(data.trackedTime),
        estimated_minutes: convertTimeToMinutes(data.estimatedTime),
      })
        .unwrap()
        .then((data) => dispatch(startTracking(data)))
        .catch(() => errorToast('Unable to start timer, please contact your administrator'))

      onClose()
    }
  }

  return (
    <Modal
      title="Start Timer"
      description="Setup your timer against a budget"
      icon={<ClockIcon />}
      isOpen={isOpen}
      onClose={onClose}
    >
      <TimeEntryForm
        onSubmit={onSubmit}
        validationSchema={newEntrySchema}
        defaultValues={{
          budget: undefined,
          task: undefined,
          description: '',
          estimatedTime: '',
          trackedTime: '',
        }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalFooter className="!mt-11">
          <Button variant="blank" onClick={onClose} disabled={creatingTimer}>
            Cancel
          </Button>
          <Button size="xs" type="submit" loading={creatingTimer}>
            <span>Start Timer</span>
          </Button>
        </ModalFooter>
      </TimeEntryForm>
    </Modal>
  )
}
