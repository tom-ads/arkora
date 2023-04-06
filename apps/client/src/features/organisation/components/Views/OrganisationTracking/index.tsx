import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormTimeInput,
  InlineTip,
  ReadOnly,
} from '@/components'
import { WeekDaysSelect } from '@/components/WeekDays'
import { OrganisationWithTasksFormFields } from '@/features/organisation'
import { convertTimeToMinutes, formatMinutesToHourMinutes } from '@/helpers/date'
import { calcDailyDuration } from '@/helpers/organisation'
import { ModalBaseProps } from '@/types'
import { DateTime } from 'luxon'
import { UseFormReturn } from 'react-hook-form'

type OrganisationTrackingViewProps = ModalBaseProps & UseFormReturn<OrganisationWithTasksFormFields>

export const OrganisationTrackingView = ({
  formState,
  watch,
  control,
}: OrganisationTrackingViewProps): JSX.Element => {
  const openingTime = DateTime.fromISO(watch('openingTime'))
  const closingTime = DateTime.fromISO(watch('closingTime'))

  const dailyGoalDuration = calcDailyDuration(
    openingTime,
    closingTime,
    convertTimeToMinutes(watch('breakDuration') ? watch('breakDuration') : '00:00'),
  )
  const weeklyGoalDuration = dailyGoalDuration * (watch('businessDays')?.length ?? [])

  return (
    <>
      <div className="flex items-center max-w-[300px]">
        <FormControl>
          <div className="space-y-[2px]">
            <FormLabel htmlFor="tracking" size="sm">
              Daily Goal
            </FormLabel>
            <ReadOnly value={formatMinutesToHourMinutes(dailyGoalDuration)} />
          </div>
        </FormControl>

        <FormControl>
          <div className="space-y-[2px]">
            <FormLabel htmlFor="tracking" size="sm">
              Weekly Goal
            </FormLabel>
            <ReadOnly value={formatMinutesToHourMinutes(weeklyGoalDuration)} />
          </div>
        </FormControl>
      </div>

      <div className="space-y-3">
        <FormControl>
          <FormLabel htmlFor="businessDays" size="sm">
            Work Days
          </FormLabel>
          <WeekDaysSelect name="businessDays" control={control} />
          {formState?.errors?.businessDays?.message && (
            <FormErrorMessage size="sm">
              {formState?.errors?.businessDays?.message}
            </FormErrorMessage>
          )}
        </FormControl>

        <InlineTip value="Selected days calculate towards weekly tracking goals." />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between gap-3">
          <FormControl>
            <FormLabel htmlFor="openingTime" size="sm">
              Opening Time
            </FormLabel>
            <FormTimeInput name="openingTime" size="sm" error={!!formState?.errors?.openingTime} />
            {formState?.errors?.openingTime?.message && (
              <FormErrorMessage size="sm">
                {formState?.errors?.openingTime?.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="closingTime" size="sm">
              Closing Time
            </FormLabel>
            <FormTimeInput name="closingTime" size="sm" error={!!formState?.errors?.closingTime} />
            {formState?.errors?.closingTime?.message && (
              <FormErrorMessage size="sm">
                {formState?.errors?.closingTime?.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="breakDuration" size="sm">
              Break Duration
            </FormLabel>
            <FormTimeInput
              name="breakDuration"
              size="sm"
              error={!!formState?.errors?.breakDuration}
            />
            {formState?.errors?.breakDuration?.message && (
              <FormErrorMessage size="sm">
                {formState?.errors?.breakDuration?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </div>

        <InlineTip value="Operating hours affect daily and weekly tracking goals." />
      </div>
    </>
  )
}
