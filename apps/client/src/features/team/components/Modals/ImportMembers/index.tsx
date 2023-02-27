import {
  BorderNone,
  BorderTopIcon,
  Button,
  FormControl,
  FormLabel,
  FormSelect,
  FormStyledRadio,
} from '@/components'
import { SelectOption } from '@/components/Forms/Select/option'
import { FormStyledRadioOption } from '@/components/Forms/StyledRadio/Option'
import { Modal, ModalFooter } from '@/components/Modal'
import UserRole from '@/enums/UserRole'
import { InviteFormFields, SelectedMember } from '../../../types'
import { parseCSV } from '@/helpers/file'
import { useToast } from '@/hooks/useToast'
import { ModalBaseProps } from '@/types'
import { unionBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { SelectedFile } from '../../SelectedFile'

type ImportMemberModalProps = ModalBaseProps & UseFormReturn<InviteFormFields>

export const ImportMemberModal = ({
  isOpen,
  onClose,
  control,
  reset,
  setValue,
  getValues,
  watch,
}: ImportMemberModalProps): JSX.Element => {
  const { errorToast } = useToast()

  const [parsedData, setParsedData] = useState<null | object[]>(null)

  const handleImport = () => {
    const headerValue = getValues('selectedHeader')

    const columnData = getValues('containsHeaders')
      ? parsedData!.slice(1, parsedData!.length)
      : parsedData

    const emailColumn: SelectedMember[] = columnData!
      .map((row) => row[headerValue as keyof typeof row])
      .map((cell: string) => ({
        email: cell,
        role: UserRole.MEMBER,
      }))
      .filter((v) => v.email)

    // Prevent duplicate emails from being passed into the members array
    const dedupedMembers = unionBy(emailColumn?.concat(getValues('members')), 'email')
    setValue('members', dedupedMembers)

    setValue('selectedFile', null)
  }

  const handleAfterLeave = () => {
    setValue('containsHeaders', false)
    setValue('selectedHeader', null)
    setParsedData(null)
  }

  const handleAbort = () => {
    setValue('selectedFile', null)
    onClose()
  }

  const selectedFile = watch('selectedFile')

  useEffect(() => {
    let isParsing = true

    const parseFile = async () => {
      if (selectedFile && isParsing) {
        const result = await parseCSV(selectedFile, 'A')
        setParsedData(result as object[])
      }
    }

    parseFile().catch(() => {
      reset()
      errorToast('Unable to import data. Please try again later or contact your administrator.')
    })

    return () => {
      isParsing = false
    }
  }, [selectedFile])

  const headingOptions = useMemo(
    () =>
      Object.entries(parsedData?.[0] ?? {}).map(([cellKey, cellValue]) => ({
        id: cellKey,
        display: getValues('containsHeaders') ? cellValue : cellKey,
      })),
    [parsedData, watch('containsHeaders')],
  )

  return (
    <Modal
      title="Import Members"
      isOpen={isOpen}
      onClose={handleAbort}
      afterLeave={handleAfterLeave}
      className="min-h-0"
    >
      <div className="space-y-6 mb-20">
        <FormControl>
          <FormLabel htmlFor="containsHeaders">Imported File</FormLabel>
          <SelectedFile value={selectedFile} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="containsHeaders">Headings</FormLabel>
          <FormStyledRadio className="flex-col sm:flex-row" name="containsHeaders">
            <FormStyledRadioOption
              title="Headings"
              icon={<BorderTopIcon />}
              description="File contains labelled headings as the first row."
              value={true}
            />
            <FormStyledRadioOption
              title="No Headings"
              icon={<BorderNone />}
              description="File contains no labelled headings as the first row."
              value={false}
            />
          </FormStyledRadio>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="emailColumn">Email</FormLabel>
          <FormSelect
            name="selectedHeader"
            control={control}
            placeHolder="Select email column"
            size="sm"
            fullWidth
          >
            {headingOptions.map((option) => (
              <SelectOption key={option.id} id={option.id}>
                {option?.display}
              </SelectOption>
            ))}
          </FormSelect>
        </FormControl>
      </div>

      <ModalFooter className="mb-4">
        <Button variant="blank" onClick={handleAbort} danger>
          Cancel Import
        </Button>
        <Button size="xs" onClick={() => handleImport()} className="max-w-[161px]">
          Import Members
        </Button>
      </ModalFooter>
    </Modal>
  )
}
