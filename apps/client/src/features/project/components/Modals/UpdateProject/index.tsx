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

  const [updateProject, { isLoading: updatingProject }] = useUpdateProjectMutation()

  const [deleteProject, { isLoading: deletingProject }] = useDeleteProjectMutation()

  const onSubmit = async (data: ProjectFormFields) => {
    await updateProject({
      id: projectId!,
      name: data.name!,
      show_cost: data.hideCost,
      private: data.private,
      client_id: data.client!,
    })
      .unwrap()
      .then(() => successToast('Project has been updated'))
      .catch(() => errorToast('Unable to update project, please try again later.'))

    onClose()
  }

  const onConfirm = async () => {
    await deleteProject(projectId!)
      .then(() => successToast('Project has been removed'))
      .catch(() => errorToast('Unable to remove project, please try again later.'))

    setOpenConfirmationModal(false)
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
          onSubmit={onSubmit}
          defaultValues={{
            name: project?.name,
            client: project?.client?.id,
            private: project?.private ?? false,
            hideCost: project?.showCost ?? true,
          }}
        >
          <ModalFooter className="!mt-20">
            <Button
              variant="blank"
              onClick={() => setOpenConfirmationModal(true)}
              disabled={loadingProject || deletingProject || updatingProject}
              danger
            >
              Delete
            </Button>
            <Button
              size="xs"
              type="submit"
              className="max-w-[161px] w-full"
              loading={updatingProject}
              disabled={deletingProject || loadingProject}
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
        description="Performing this action will permanently delete any budgets, tasks and tracked time associated with this project. It cannot be recovered."
      />
    </>
  )
}
