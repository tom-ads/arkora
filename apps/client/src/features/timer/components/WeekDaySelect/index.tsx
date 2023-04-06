import { setSelectedDay } from '@/stores/slices/timer'
import { RootState } from '@/stores/store'
import classNames from 'classnames'
import { DateTime, Info } from 'luxon'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const WeekDaySelect = (): JSX.Element => {
  const dispatch = useDispatch()

  const { timesheet } = useSelector((state: RootState) => ({
    timesheet: state.timer.timesheet,
  }))

  const handleSelectedDay = (selectedDay: string) => {
    dispatch(setSelectedDay({ selectedDay: DateTime.fromISO(selectedDay).toISODate() }))
  }

  const weekDays = useMemo(() => {
    const currentStartDate = DateTime.fromISO(timesheet.startDate!)
    const days = Info.weekdaysFormat('short')

    return days.map((weekDay, idx) => ({
      weekDayShort: weekDay,
      iso: currentStartDate.plus({ days: idx }).toISO(),
      formattedDate: currentStartDate.plus({ days: idx }).toFormat('LLL dd').toUpperCase(),
      isSelected: currentStartDate
        .plus({ days: idx })
        .equals(DateTime.fromISO(timesheet.selectedDay)),
    }))
  }, [timesheet.startDate, timesheet.endDate, timesheet.selectedDay])

  return (
    <>
      {weekDays?.map((weekDay) => (
        <button
          type="button"
          key={weekDay.iso}
          onClick={() => handleSelectedDay(weekDay.iso)}
          className={classNames(
            'lg:space-y-[2px] px-1 pb-2 lg:pb-4 border-b-[2px] outline-none text-start transition-all group',
            {
              'border-white': !weekDay.isSelected,
              'border-purple-90 group-hover:text-purple-80': weekDay.isSelected,
            },
          )}
        >
          <p
            className={classNames('font-semibold text-sm md:text-base lg:text-xl', {
              'text-gray-100': !weekDay.isSelected,
              'text-purple-90 group-hover:text-purple-80': weekDay.isSelected,
            })}
          >
            {weekDay.weekDayShort}
          </p>
          <p className="text-xs md:text-sm lg:text-base text-gray-70 flex lg:gap-x-1 items-center">
            <span
              className={classNames('shrink-0 w-12 sm:w-14 lg:w-[62px]', {
                'text-purple-90 group-hover:text-purple-80': weekDay.isSelected,
              })}
            >
              {weekDay.formattedDate}
            </span>
          </p>
        </button>
      ))}
    </>
  )
}
