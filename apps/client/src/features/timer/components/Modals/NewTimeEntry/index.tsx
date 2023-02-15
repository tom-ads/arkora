import { Button, ClockIcon, PlayIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { ModalBaseProps } from '@/types'
import { TimeEntryForm } from '../../Forms/TimeEntryForm'

type StartTimerModalProps = ModalBaseProps

export const NewTimeEntryModal = ({ isOpen, onClose }: StartTimerModalProps): JSX.Element => {
  return (
    <Modal
      title="New Time Entry"
      description="Start tracking your time"
      icon={<ClockIcon />}
      isOpen={isOpen}
      onClose={onClose}
    >
      <TimeEntryForm isOpen={isOpen} onClose={onClose}>
        <ModalFooter className="!mt-11">
          <Button variant="blank" onClick={onClose}>
            Cancel
          </Button>
          <Button size="xs" type="submit" className="max-w-[161px] w-full">
            <PlayIcon className="w-4 h-4 shrink-0" />
            <span>Start Timer</span>
          </Button>
        </ModalFooter>
      </TimeEntryForm>
    </Modal>
  )
}
