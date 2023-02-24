import {
  BinIcon,
  Button,
  FormControl,
  FormInput,
  FormLabel,
  FormSelect,
  PlusIcon,
} from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { SelectOption } from '@/components/Forms/Select/option'
import UserRole from '@/enums/UserRole'
import { SelectedRole } from './../../../types'
import { useMemo } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export interface TeamProps {
  team: Array<{
    email: string
    role: SelectedRole
  }>
}

type FormFields = {
  email: string
  role: SelectedRole
} & TeamProps

type InviteTeamProps = UseFormReturn<FormFields, 'Team'>

export const InviteTeam = ({
  setError,
  getValues,
  control,
  setValue,
  clearErrors,
  formState: { errors },
}: InviteTeamProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray<FormFields>({
    name: 'team',
    control,
  })

  const handleAddMember = () => {
    const email = getValues('email')
    const emailValidation = z.string().email()

    const validation = Object.values({
      required: {
        test: email,
        errorMessage: 'Email is required',
      },
      valid: {
        test: emailValidation.safeParse(getValues('email'))?.success,
        errorMessage: 'Valid email required',
      },
      alreadyExists: {
        test: !fields.some((member) => member.email === email),
        errorMessage: 'Team member already in invite list',
      },
    })?.filter((v) => !v.test)

    if (validation?.length) {
      // Only return first error message each time
      setError('email', { message: validation?.[0]?.errorMessage })
      return
    }

    clearErrors()
    append({
      email: getValues('email'),
      role: getValues('role'),
    })
    setValue('email', '')
  }

  // User can only be owner
  const roleOptions = useMemo(
    () =>
      Object.values(UserRole)
        .filter((r) => r !== UserRole.OWNER)
        .map((role) => ({
          id: role,
          display: role.toLowerCase()?.replace('_', ' '),
        })),
    [],
  )

  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3">
        <FormControl>
          <FormLabel htmlFor="email" size="sm">
            Email
          </FormLabel>
          <FormInput name="email" placeHolder="Enter email" size="sm" error={!!errors.email} />
          {errors.email?.message && (
            <FormErrorMessage size="sm">{errors.email?.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl className="max-w-[150px]">
          <FormLabel htmlFor="role" size="sm">
            Role
          </FormLabel>
          <FormSelect name="role" control={control} placeHolder="Select role">
            {roleOptions?.map((option) => (
              <SelectOption key={option.id} id={option.id}>
                {option?.display}
              </SelectOption>
            ))}
          </FormSelect>
          {errors.role?.message && (
            <FormErrorMessage size="sm">{errors.role?.message}</FormErrorMessage>
          )}
        </FormControl>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="blank"
          className="text-sm flex gap-x-1"
          onClick={handleAddMember}
        >
          <PlusIcon className="w-5 h-5 pointer-events-none" aria-hidden />
          <span>Add Member</span>
        </Button>
      </div>

      {/* Inline table as this differs from main app table significantly, can be refactored later */}
      <table className="w-full table-fixed">
        <thead>
          <tr className="text-gray-100 font-medium text-sm border-b border-gray-30 text-justify">
            <th scope="col" className="py-2">
              Email
            </th>
            <th scope="col" className="py-2 w-[140px]">
              Role
            </th>
            <th scope="col" className="py-2 w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {fields?.map((teamMember, idx) => (
            <tr
              key={teamMember.id}
              className="border-b border-gray-30 text-sm text-gray-80 transition-all"
            >
              <td className="p-2 truncate">{teamMember?.email}</td>
              <td className="p-2">
                <FormSelect
                  control={control}
                  name={`team.${idx}.role`}
                  placeHolder="Select role"
                  size="xs"
                >
                  {roleOptions?.map((option) => (
                    <SelectOption key={option.id} id={option.id}>
                      {option?.display}
                    </SelectOption>
                  ))}
                </FormSelect>
              </td>
              <td className="p-2 align-middle text-center">
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="outline-non w-5 h-5 text-red-90"
                >
                  <BinIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
