import {
  Avatar,
  Form,
  FormCheckbox,
  FormControl,
  FormInput,
  FormLabel,
  FormMultiSelect,
  FormSelect,
  UsersIcon,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { SelectOption } from '@/components/Forms/Select/option'
import UserRole from '@/enums/UserRole'
import { useGetAccountsQuery } from '@/features/accounts'
import { useGetClientsQuery } from '@/features/client'
import { User } from '@/types'
import { Transition } from '@headlessui/react'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode, useMemo } from 'react'
import { z } from 'zod'

export type ProjectFormFields = {
  name: string
  client: {
    id: number | undefined
    value: string | undefined
    children: string | undefined
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
    id: z.number(),
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

type ProjectFormProps = {
  isOpen: boolean
  children: ReactNode
  defaultValues?: Partial<
    Omit<ProjectFormFields, 'team'> & {
      team: User[]
    }
  >
  error?: FetchBaseQueryError | SerializedError
  onSubmit: (data: ProjectFormFields) => void
}

export const ProjectForm = ({
  isOpen,
  onSubmit,
  error,
  defaultValues,
  children,
}: ProjectFormProps): JSX.Element => {
  const { data: orgClients } = useGetClientsQuery(undefined, {
    skip: !isOpen,
  })

  const { data: orgAccounts } = useGetAccountsQuery(
    { role: UserRole.MEMBER },
    {
      skip: !isOpen,
    },
  )

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

  const defaultState = useMemo(() => {
    const teamMembers = teamOptions?.filter((member) =>
      defaultValues?.team?.some((selected) => selected?.id === member?.id),
    )

    return {
      ...defaultValues,
      team: teamMembers,
    }
  }, [defaultValues, teamOptions, clientOptions])

  return (
    <Form<ProjectFormFields, typeof projectSchema>
      onSubmit={onSubmit}
      className="space-y-6"
      validationSchema={projectSchema}
      queryError={error}
      defaultValues={{
        name: defaultState?.name ?? undefined,
        client: {
          id: defaultState?.client?.id ?? undefined,
          value: defaultState?.client?.value ?? undefined,
          children: defaultState?.client?.children ?? undefined,
        },
        private: defaultState?.private ?? false,
        hideCost: defaultState?.hideCost ?? false,
        team: defaultState?.team ?? [],
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
              {errors?.team?.message && <FormErrorMessage>{errors.team.message}</FormErrorMessage>}
            </FormControl>
          </Transition>

          {children}
        </>
      )}
    </Form>
  )
}
