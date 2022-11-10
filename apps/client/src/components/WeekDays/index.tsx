import { WeekDay } from '@/enums/WeekDay'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Controller } from 'react-hook-form'

type WeekDaysSelectProps = {
  name: string
  control: any
}

export const WeekDaysSelect = ({ name, control }: WeekDaysSelectProps): JSX.Element => {
  const weekDays = useMemo(
    () =>
      Object.values(WeekDay).map((weekDay) => ({
        weekDay,
        abbre: weekDay.slice(0, 3).toLowerCase(),
      })),
    [],
  )

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleSelection = (weekDay: WeekDay, selected: boolean) => {
          field.onChange(
            selected
              ? field.value.filter((day: WeekDay) => day !== weekDay)
              : [...field.value, weekDay],
          )
        }

        return (
          <div className="flex gap-2 flex-wrap">
            {weekDays.map((weekDay) => (
              <button
                type="button"
                onClick={() =>
                  handleSelection(
                    weekDay.weekDay,
                    field.value?.some((day: WeekDay) => day === weekDay.weekDay),
                  )
                }
                className={classNames(
                  'border rounded h-9 w-10 text-gray-80 border-gray-40 capitalize grid place-content-center outline-none transition-all hover:bg-gray-10 focus-visible:bg-gray-10',
                  {
                    '!border-purple-90 !text-purple-90 shadow-sm shadow-purple-70':
                      field.value?.some((day: WeekDay) => day === weekDay.weekDay),
                  },
                )}
                key={weekDay.weekDay}
              >
                <span className="text-xs font-medium">{weekDay.abbre}</span>
              </button>
            ))}
          </div>
        )
      }}
    />
  )
}
