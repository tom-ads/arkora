import {
  Avatar,
  Button,
  Form,
  FormControl,
  FormInput,
  FormLabel,
  FormMultiselect,
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
import { ModalBaseProps } from '@/types'
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
  team: Array<string>
}

const projectSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  private: z.boolean(),
  hideCost: z.boolean(),
})

type CreateProjectModalProps = ModalBaseProps

export const CreateProjectModal = (props: CreateProjectModalProps): JSX.Element => {
  const { data: orgClients } = useGetClientsQuery(undefined, {
    skip: !props.isOpen,
  })

  const { data: orgAccounts } = useGetAccountsQuery(
    { role: UserRole.MEMBER },
    {
      skip: !props.isOpen,
    },
  )

  const handleSubmit = (data: FormFields) => {
    console.log(data)
  }

  const clientOptions = useMemo(() => {
    return (
      orgClients?.clients.map((client) => ({
        id: client.id,
        value: client.name,
        display: client.name,
      })) ?? []
    )
  }, [orgClients?.clients])

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
        onSubmit={handleSubmit}
        className="space-y-6"
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
        {({ control, formState: { errors } }) => (
          <>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <FormInput name="name" placeHolder="Enter name" error={!!errors?.name?.message} />
              {errors?.name?.message && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>
            <FormControl>
              <FormLabel>Client</FormLabel>
              <FormSelect name="client" control={control} placeHolder="Select client" fullWidth>
                {clientOptions?.map((option) => (
                  <SelectOption key={option.id} value={option.value}>
                    {option?.display}
                  </SelectOption>
                ))}
              </FormSelect>
            </FormControl>
            <FormControl>
              <FormLabel>Team</FormLabel>
              <FormMultiselect name="team" control={control} placeHolder="Select members" fullWidth>
                {teamOptions?.map((option) => (
                  <SelectOption key={option.id} value={option.value}>
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
              </FormMultiselect>
            </FormControl>
          </>
        )}
      </Form>
      <ModalFooter className="mt-24">
        <Button variant="blank" onClick={props.onClose}>
          Cancel
        </Button>
        <Button size="xs">Create Project</Button>
      </ModalFooter>
    </Modal>
  )
}
