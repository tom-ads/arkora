import { Button, HouseIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { useCreateProjectMutation } from '@/features/project'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { ProjectForm, ProjectFormFields } from '../../Forms/ProjectForm'

type CreateProjectModalProps = ModalBaseProps

export const CreateProjectModal = (props: CreateProjectModalProps): JSX.Element => {
  const { successToast, errorToast } = useToast()

  const [createProject, { isLoading: creatingProject, error, reset: resetMutation }] =
    useCreateProjectMutation()

  const reset = () => {
    resetMutation()
    props.onClose()
  }

  const onSubmit = async (data: ProjectFormFields) => {
    if (data?.client) {
      await createProject({
        name: data.name,
        show_cost: data.hideCost,
        private: data.private,
        client_id: data.client,
        team: data?.team?.map((member) => member.id),
      })
        .unwrap()
        .then(() => {
          reset()
          successToast('Project has been created')
        })
        .catch((error) => {
          if (error.status === 422) {
            return
          }
          reset()
          errorToast('Unable to create project, please try again later')
        })
    }
  }

  return (
    <Modal
      title="Create Project"
      description="Add a new client project and invite the team"
      icon={<HouseIcon />}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ProjectForm {...props} onSubmit={onSubmit} error={error}>
        <ModalFooter className="!mt-36">
          <Button variant="blank" onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            size="xs"
            type="submit"
            loading={creatingProject}
            className="max-w-[161px] w-full"
          >
            Create Project
          </Button>
        </ModalFooter>
      </ProjectForm>
    </Modal>
  )
}
