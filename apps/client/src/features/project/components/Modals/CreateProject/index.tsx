import {
  Avatar,
  Button,
  Form,
  FormCheckbox,
  FormControl,
  FormInput,
  FormLabel,
  FormMultiSelect,
  FormSelect,
  HouseIcon,
  UsersIcon,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { SelectOption } from '@/components/Forms/Select/option'
import { Modal, ModalFooter } from '@/components/Modal'
import UserRole from '@/enums/UserRole'
import { useGetAccountsQuery } from '@/features/accounts'
import { useGetClientsQuery } from '@/features/client'
import { useCreateProjectMutation } from '@/features/project'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { Transition } from '@headlessui/react'
import { useMemo } from 'react'
import { z } from 'zod'

type FormFields = {
  name: string
  client: {
    value: string
    children: string
  }
  private: boolean
  hideCost: boolean
  team: Array<{ id: number; value: string }>
}

const projectSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  private: z.boolean(),
  hideCost: z.boolean(),
  client: z.object({
    value: z.string({ required_error: 'Client is required' }),
    children: z.string(),
  }),
  team: z
    .array(
      z.object({
        id: z.number(),
        value: z.string(),
      }),
    )
    .optional(),
})

type CreateProjectModalProps = ModalBaseProps

export const CreateProjectModal = (props: CreateProjectModalProps): JSX.Element => {
  const { successToast, errorToast } = useToast()

  const { data: orgClients } = useGetClientsQuery(undefined, {
    skip: !props.isOpen,
  })

  const { data: orgAccounts } = useGetAccountsQuery(
    { role: UserRole.MEMBER },
    {
      skip: !props.isOpen,
    },
  )

  const [createProject, { isLoading: creatingProject, error, reset: resetMutation }] =
    useCreateProjectMutation()

  const reset = () => {
    resetMutation()
    props.onClose()
  }

  const onSubmit = async (data: FormFields) => {
    const client = orgClients?.clients?.find((client) => client.name === data.client.value)
    console.log(data.team)
    if (client?.id) {
      await createProject({
        name: data.name,
        show_cost: data.hideCost,
        private: data.private,
        client_id: client.id,
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

  const clientOptions = useMemo(
    () =>
      orgClients?.clients.map((client) => ({
        id: client.id,
        value: client.name,
        display: client.name,
      })) ?? [],
    [orgClients?.clients],
  )

  const teamOptions = useMemo(
    () =>
      orgAccounts?.accounts.map((account) => {
        const fullName = `${account.firstname} ${account.lastname}`
        return {
          id: account.id,
          value: fullName,
          display: fullName,
          info: {
            email: account.email,
          },
        }
      }) ?? [],
    [orgAccounts?.accounts],
  )

  return (
    <Modal
      title="Create Project"
      description="Track client project progression and view insights"
      icon={<HouseIcon />}
      {...props}
    >
      <Form<FormFields, typeof projectSchema>
        onSubmit={onSubmit}
        className="space-y-6"
        validationSchema={projectSchema}
        queryError={error}
        defaultValues={{
          name: '',
          client: {
            value: undefined,
            children: undefined,
          },
          private: false,
          hideCost: false,
          team: [],
        }}
      >
        {({ control, watch, formState: { errors } }) => (
          <>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <FormInput name="name" placeHolder="Enter name" error={!!errors?.name?.message} />
              {errors?.name?.message && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="client">Client</FormLabel>
              <FormSelect
                name="client"
                control={control}
                placeHolder="Select client"
                error={!!errors?.client?.value?.message}
                fullWidth
              >
                {clientOptions?.map((option) => (
                  <SelectOption id={option.id} key={option.id} value={option.value}>
                    {option?.display}
                  </SelectOption>
                ))}
              </FormSelect>
              {errors?.client?.value?.message && (
                <FormErrorMessage>{errors.client.value?.message}</FormErrorMessage>
              )}
            </FormControl>

            <div className="flex flex-grow-0 max-w-[250px]">
              <FormControl className="!flex-row gap-x-3">
                <FormCheckbox name="private" error={!!errors?.private?.message} />
                <FormLabel htmlFor="private">Private?</FormLabel>
              </FormControl>

              <FormControl className="!flex-row gap-x-3">
                <FormCheckbox name="hideCost" error={!!errors?.hideCost?.message} />
                <FormLabel htmlFor="hideCost">Hide Cost?</FormLabel>
              </FormControl>
            </div>

            <Transition
              show={watch('private')}
              enter="transition duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <FormControl>
                <FormLabel htmlFor="team">Team</FormLabel>
                <FormMultiSelect
                  name="team"
                  control={control}
                  placeHolder="Select members"
                  error={!!errors?.team?.message}
                  fullWidth
                >
                  {teamOptions?.map((option) => (
                    <SelectOption
                      id={option.id}
                      key={`team-select-${option.id}`}
                      value={option.value}
                    >
                      <div className="flex gap-x-4 items-center">
                        <Avatar className="w-[34px] h-[34px]">
                          <UsersIcon className="w-5 h-5" />
                        </Avatar>
                        <div>
                          <p className="font-semibold ">{option.display}</p>
                          <p className="text-xs max-w-[350px] truncate">{option.info.email}</p>
                        </div>
                      </div>
                    </SelectOption>
                  ))}
                </FormMultiSelect>
                {errors?.team?.message && (
                  <FormErrorMessage>{errors.team.message}</FormErrorMessage>
                )}
              </FormControl>
            </Transition>

            <ModalFooter className="!mt-36">
              <Button variant="blank" onClick={props.onClose}>
                Cancel
              </Button>
              <Button
                size="xs"
                type="submit"
                isLoading={creatingProject}
                className="max-w-[161px] w-full"
              >
                Create Project
              </Button>
            </ModalFooter>
          </>
        )}
      </Form>
    </Modal>
  )
}
