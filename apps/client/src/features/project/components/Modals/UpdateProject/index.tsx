import { Button, HouseIcon } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { ConfirmationModal } from '@/components/Modals'
import {
  useDeleteProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from '../../../api'
import { ModalBaseProps } from '@/types'
import { ProjectForm, ProjectFormFields } from '../../Forms/ProjectForm'
import { useState } from 'react'
import { useToast } from '@/hooks/useToast'

type UpdateProjectModalProps = ModalBaseProps & {
  projectId: number | null
}

export const UpdateProjectModal = ({
  projectId,
  onClose,
  isOpen,
}: UpdateProjectModalProps): JSX.Element => {
  const { successToast, errorToast } = useToast()

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { data: project, isFetching: loadingProject } = useGetProjectQuery(projectId!, {
    skip: !projectId,
  })

  const [triggerUpdate, { isLoading: updatingProject }] = useUpdateProjectMutation()

  const [triggerDelete, { isLoading: deletingProject }] = useDeleteProjectMutation()

  const onSubmit = async (data: ProjectFormFields) => {
    await triggerUpdate({
      id: projectId!,
      body: {
        name: data.name,
        show_cost: data.hideCost,
        private: data.private,
        client_id: data.client!,
        team: data?.team?.map((member) => member.id),
      },
    })
      .unwrap()
      .then(() => {
        onClose()
        successToast('Project has been updated')
      })
      .catch(() => errorToast('Unable to update project, please try again later.'))
  }

  const onConfirm = async () => {
    setOpenConfirmationModal(false)

    await triggerDelete(projectId!)
      .then(() => successToast('Project has been deleted'))
      .catch(() => errorToast('Unable to delete project, please try again later.'))

    onClose()
  }

  return (
    <>
      <Modal
        title="Update Project"
        description="Manage your project"
        icon={<HouseIcon />}
        isOpen={isOpen}
        onClose={onClose}
        loading={loadingProject}
      >
        <ProjectForm
          isOpen={isOpen}
          defaultValues={{
            name: project?.name,
            client: project?.client?.id,
            private: project?.private,
            hideCost: project?.showCost,
            team: project?.members,
          }}
          onSubmit={onSubmit}
        >
          <ModalFooter className="!mt-36">
            <Button variant="blank" onClick={() => setOpenConfirmationModal(true)} danger>
              Delete
            </Button>
            <Button
              size="xs"
              type="submit"
              className="max-w-[161px] w-full"
              loading={updatingProject}
            >
              Update Project
            </Button>
          </ModalFooter>
        </ProjectForm>
      </Modal>

      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={onConfirm}
        loading={deletingProject}
        title="You're about to delete a project"
        btnText="Delete Project"
        description="Performing this action will permenently delete any budgets, tasks and tracked time associated with this project. It cannot be recovered."
      />
    </>
  )
}
