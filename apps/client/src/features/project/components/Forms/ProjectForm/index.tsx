import {
  Form,
  FormControl,
  FormInput,
  FormLabel,
  FormSelect,
  FormStyledRadio,
  HorizontalDivider,
  InfoCircleIcon,
  LockIcon,
  OpenLockIcon,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { SelectOption } from '@/components/Forms/Select/option'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import { useGetClientsQuery } from '@/features/client'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { ReactNode, useMemo } from 'react'
import { z } from 'zod'

export type ProjectFormFields = {
  name: string | undefined
  client: number | undefined
  private: boolean
  hideCost: boolean
}

export const projectSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  private: z.boolean(),
  hideCost: z.boolean(),
  client: z.number(),
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
              <div className="flex items-center gap-2">
                <InfoCircleIcon className="w-5 h-5" />
                <p className="text-gray-80 text-sm">
                  Members can be assigned after project has been created
                </p>
              </div>
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
                value={false}
              />
              <FormStyledRadioOption
                title="Hide"
                icon={<LockIcon />}
                description="Only managers and admins can view project and budget costs"
                value={true}
              />
            </FormStyledRadio>
          </FormControl>

          {children}
        </>
      )}
    </Form>
  )
}
