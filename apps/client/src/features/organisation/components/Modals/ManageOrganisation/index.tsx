import { Button, Form, FormatDateTime, HorizontalDivider, TabGroup, TabItem } from '@/components'
import { Modal, ModalFooter } from '@/components/Modal'
import { OrganisationWithTasksFormFields } from './../../../types'
import { useUpdateOrganisationMutation } from './../../../api'
import { convertToPennies, convertToPounds } from '@/helpers/currency'
import { convertTimeToMinutes, formatMinutesToTime } from '@/helpers/date'
import { useToast } from '@/hooks/useToast'
import { RootState } from '@/stores/store'
import { ModalBaseProps } from '@/types'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import {
  OrganisationDetailsView,
  OrganisationRatesView,
  OrganisationTasksView,
  OrganisationTrackingView,
} from '../../Views'
import { setOrganisation } from '@/stores/slices/organisation'
import hourlyRateSchema from '@/helpers/validation/hourly_rate'
import { taskSchema } from '@/features/task'
import { useAuthorization } from '@/hooks/useAuthorization'

type SelectedTab = 'details' | 'tracking' | 'rates' | 'tasks'

const validationSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    businessDays: z.array(z.string()).nonempty({ message: 'At least 1 work day required' }),
    openingTime: z.string().trim().min(1, { message: 'Opening time is required' }),
    closingTime: z.string().trim().min(1, { message: 'Closing time is required' }),
    currency: z.string(),
    breakDuration: z.string().trim().min(1, { message: 'Break duration is required' }),
    defaultRate: hourlyRateSchema,
    defaultTasks: z.array(taskSchema),
  })
  .superRefine((fields, ctx) => {
    const openingTime = DateTime.fromFormat(fields.openingTime, 'HH:mm')
    const closingTime = DateTime.fromFormat(fields.closingTime, 'HH:mm')

    if (openingTime >= closingTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Opening time must be before closing time',
        path: ['openingTime'],
      })
    }

    if (closingTime <= openingTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Closing time must be after opening time',
        path: ['closingTime'],
      })
    }

    const workDayDuration = closingTime.diff(openingTime).as('minutes')
    const breakDuration = convertTimeToMinutes(fields.breakDuration ?? 0)

    if (breakDuration >= workDayDuration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Break duration cannot exceed work day duration',
        path: ['breakDuration'],
      })
    }
  })

export const ManageOrganisationModal = (props: ModalBaseProps): JSX.Element => {
  const dispatch = useDispatch()

  const [selectedTab, setSelectedTab] = useState<SelectedTab>('details')

  const { successToast, errorToast } = useToast()

  const { checkPermission } = useAuthorization()

  const { organisation } = useSelector((state: RootState) => ({
    organisation: state.organisation,
  }))

  const [updateOrganisation, { isLoading: updatingOrganisation, error }] =
    useUpdateOrganisationMutation()

  const handleAfterLeave = () => {
    setSelectedTab('details')
  }

  const handleSubmit = async (data: OrganisationWithTasksFormFields) => {
    if (organisation.id) {
      await updateOrganisation({
        ...data,
        id: organisation.id,
        breakDuration: convertTimeToMinutes(data.breakDuration),
        defaultRate: convertToPennies(data.defaultRate),
      })
        .unwrap()
        .then((res) => {
          successToast('Organisation has been updated')
          dispatch(setOrganisation(res))
          props.onClose()
        })
        .catch((err) => {
          if (err.status === 422) return
          errorToast('Unable to update organisation, please try again later.')
          props.onClose()
        })
    }
  }

  return (
    <Modal
      title="Organisation"
      isOpen={props.isOpen}
      onClose={props.onClose}
      afterLeave={handleAfterLeave}
      className="max-w-[500px]"
    >
      <>
        <div className="flex gap-x-10 items-center">
          <div className="space-y-[2px]">
            <p className="font-medium text-base text-gray-50">Joined</p>
            <p className="font-semibold text-base text-gray-80">
              <FormatDateTime value={organisation.createdAt} format={DateTime.DATE_MED} />
            </p>
          </div>
        </div>

        <div className="my-6">
          <TabGroup className="gap-x-5">
            <TabItem isActive={selectedTab === 'details'} onClick={() => setSelectedTab('details')}>
              Details
            </TabItem>
            {checkPermission('organisation:update') && (
              <>
                <TabItem
                  isActive={selectedTab === 'tracking'}
                  onClick={() => setSelectedTab('tracking')}
                >
                  Tracking
                </TabItem>
                <TabItem isActive={selectedTab === 'rates'} onClick={() => setSelectedTab('rates')}>
                  Rates
                </TabItem>
                <TabItem isActive={selectedTab === 'tasks'} onClick={() => setSelectedTab('tasks')}>
                  Tasks
                </TabItem>
              </>
            )}
          </TabGroup>
          <HorizontalDivider />
        </div>

        <Form<OrganisationWithTasksFormFields, typeof validationSchema>
          className="min-h-[370px] gap-y-6"
          onSubmit={handleSubmit}
          queryError={error}
          defaultValues={{
            name: organisation?.name ?? '',
            subdomain: organisation?.subdomain ?? '',
            businessDays: organisation?.businessDays ?? [],
            openingTime: organisation?.openingTime ?? '',
            closingTime: organisation?.closingTime ?? '',
            breakDuration: formatMinutesToTime(organisation?.breakDuration ?? 0),
            currency: organisation?.currency?.code ?? 'GBP',
            defaultRate: convertToPounds(organisation?.defaultRate ?? 0) ?? null,
            defaultTasks: organisation?.commonTasks ?? [],
          }}
          validationSchema={validationSchema}
        >
          {(methods) => (
            <>
              {selectedTab === 'details' && <OrganisationDetailsView {...props} {...methods} />}
              {selectedTab === 'tracking' && <OrganisationTrackingView {...props} {...methods} />}
              {selectedTab === 'rates' && <OrganisationRatesView {...props} {...methods} />}
              {selectedTab === 'tasks' && <OrganisationTasksView {...props} {...methods} />}

              <ModalFooter>
                <Button variant="blank" onClick={props.onClose} disabled={updatingOrganisation}>
                  Cancel
                </Button>
                {checkPermission('organisation:update') && (
                  <Button size="xs" type="submit" loading={updatingOrganisation}>
                    Update Organisation
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </Form>
      </>
    </Modal>
  )
}
