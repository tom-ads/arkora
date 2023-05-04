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
import { useNavigate } from 'react-router-dom'
import ProjectStatus from '@/enums/ProjectStatus'

type ManageProjectModalProps = ModalBaseProps & {
  projectId: number | null
}

export const ManageProjectModal = ({
  projectId,
  onClose,
  isOpen,
}: ManageProjectModalProps): JSX.Element => {
  const { successToast, errorToast } = useToast()

  const navigate = useNavigate()

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const { data: project, isFetching: loadingProject } = useGetProjectQuery(projectId!, {
    skip: !projectId,
  })

  const [updateProject, { isLoading: updatingProject, error: updateError }] =
    useUpdateProjectMutation()

  const [deleteProject, { isLoading: deletingProject, isSuccess: isDeleted }] =
    useDeleteProjectMutation()

  const onSubmit = async (data: ProjectFormFields) => {
    await updateProject({
      id: projectId!,
      name: data.name!,
      show_cost: data.hideCost,
      private: data.private,
      client_id: data.client!,
      status: data.status,
    })
      .unwrap()
      .then(() => {
        onClose()
        successToast('Project has been updated')
      })
      .catch((error) => {
        if (error.status === 422) return
        onClose()
        errorToast('Unable to update project, please try again later.')
      })
  }

  const handleConfirmationLeave = () => {
    if (isDeleted) {
      onClose()
    }
  }

  const handleProjectLeave = () => {
    if (isDeleted) {
      navigate('/projects')
    }
  }

  const onConfirm = async () => {
    await deleteProject(projectId!)
      .then(() => successToast('Project has been removed'))
      .catch(() => errorToast('Unable to remove project, please try again later.'))

    setOpenConfirmationModal(false)
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
        afterLeave={handleProjectLeave}
      >
        <ProjectForm
          isOpen={isOpen}
          onSubmit={onSubmit}
          error={updateError}
          defaultValues={{
            name: project?.name,
            client: project?.client?.id,
            private: project?.private ?? false,
            hideCost: project?.showCost ?? true,
            status: project?.status ?? ProjectStatus.ACTIVE,
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
        afterLeave={handleConfirmationLeave}
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
