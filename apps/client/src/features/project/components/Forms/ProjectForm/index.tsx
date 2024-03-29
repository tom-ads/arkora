import {
  Form,
  FormControl,
  FormInput,
  FormLabel,
  FormSelect,
  FormStyledRadio,
  HorizontalDivider,
  LockIcon,
  OpenLockIcon,
  FormErrorMessage,
  InlineTip,
} from '@/components'
import { SelectOption } from '@/components/Forms/Select/option'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import ProjectStatus from '@/enums/ProjectStatus'
import { useGetClientsQuery } from '@/features/client'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { startCase, upperFirst } from 'lodash'
import { ReactNode, useMemo } from 'react'
import { z } from 'zod'

export type ProjectFormFields = {
  name: string | undefined
  client: number | undefined
  private: boolean
  hideCost: boolean
  status: ProjectStatus
}

export const projectSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  private: z.boolean(),
  hideCost: z.boolean(),
  client: z.number(),
  status: z.nativeEnum(ProjectStatus),
})

type ProjectFormProps = {
  isOpen: boolean
  children: ReactNode
  defaultValues?: ProjectFormFields
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
  const { data: clients } = useGetClientsQuery(undefined, {
    skip: !isOpen,
  })

  const clientOptions = useMemo(
    () =>
      clients?.map((client) => ({
        id: client.id,
        display: client.name,
      })) ?? [],
    [clients],
  )

  const statusOptions = useMemo(
    () =>
      Object.values(ProjectStatus)?.map((status) => ({
        id: status,
        display: status,
      })) ?? [],
    [clients],
  )

  return (
    <Form<ProjectFormFields, typeof projectSchema>
      onSubmit={onSubmit}
      className="space-y-6"
      validationSchema={projectSchema}
      queryError={error}
      defaultValues={{
        name: defaultValues?.name ?? undefined,
        client: defaultValues?.client ?? undefined,
        private: defaultValues?.private ?? false,
        hideCost: defaultValues?.hideCost ?? true,
        status: defaultValues?.status ?? ProjectStatus.ACTIVE,
      }}
    >
      {({ control, watch, formState: { errors } }) => (
        <>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput name="name" placeHolder="Enter name" error={!!errors?.name?.message} />
            {errors?.name?.message && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
          </FormControl>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FormControl>
                <FormLabel htmlFor="client">Client</FormLabel>
                <FormSelect
                  name="client"
                  control={control}
                  placeHolder="Select client"
                  error={!!errors?.client?.message}
                  fullWidth
                >
                  {clientOptions?.map((option) => (
                    <SelectOption key={option.id} id={option.id}>
                      {option?.display}
                    </SelectOption>
                  ))}
                </FormSelect>
                {errors?.client?.message && (
                  <FormErrorMessage>{errors.client?.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="status">Status</FormLabel>
                <FormSelect
                  name="status"
                  control={control}
                  placeHolder="Select status"
                  error={!!errors?.status?.message}
                  fullWidth
                >
                  {statusOptions?.map((option) => (
                    <SelectOption key={option.id} id={option.id}>
                      {startCase(upperFirst(option?.display?.toLowerCase()))}
                    </SelectOption>
                  ))}
                </FormSelect>
                {errors?.status?.message && (
                  <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
                )}
              </FormControl>
            </div>

            {[ProjectStatus.ARCHIVED, ProjectStatus.PENDING].includes(watch('status')) && (
              <InlineTip value="Project members can't track their time until the status is active" />
            )}
          </div>

          <div className="space-y-3">
            <FormControl>
              <FormLabel htmlFor="private">Visibility</FormLabel>
              <FormStyledRadio className="flex-col sm:flex-row" name="private">
                <FormStyledRadioOption
                  title="Public"
                  icon={<OpenLockIcon />}
                  description="All organisation team members can view this project"
                  value={false}
                />
                <FormStyledRadioOption
                  title="Private"
                  icon={<LockIcon />}
                  description="Only assigned team members can view this project"
                  value={true}
                />
              </FormStyledRadio>
            </FormControl>

            {!!watch('private') && (
              <InlineTip value="Members can be assigned after project has been created." />
            )}
          </div>

          <HorizontalDivider
            contentLeft={
              <p className="whitespace-nowrap font-medium text-base text-gray-100">Project Cost</p>
            }
          />

          <FormControl>
            <FormStyledRadio className="flex-col sm:flex-row" name="hideCost">
              <FormStyledRadioOption
                title="Show"
                icon={<OpenLockIcon />}
                description="Assigned project members can view project and budget costs"
                value={true}
              />
              <FormStyledRadioOption
                title="Hide"
                icon={<LockIcon />}
                description="Only managers and admins can view project and budget costs"
                value={false}
              />
            </FormStyledRadio>
          </FormControl>

          {children}
        </>
      )}
    </Form>
  )
}
