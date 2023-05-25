import { HorizontalDivider } from '@/components/Divider'
import { CircleTick } from '@/components/Icons'
import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

export type GroupOption = {
  id: string | number
  display: string
}

type GroupOptionProps = {
  name: string
  group: GroupOption[]
}

export const GroupOption = ({ name, group }: GroupOptionProps): JSX.Element => {
  const options = Object.values(group)

  return (
    <>
      {/* Group Heading */}
      <li className="text-base font-medium py-1 my-1 pointer-events-none capitalize text-gray-100">
        {name}
        <div className="pt-2">
          <HorizontalDivider />
        </div>
      </li>

      {/* List */}
      {options?.map((option) => (
        <Listbox.Option
          key={`group-${name}-option-${option.id}`}
          value={option?.id}
          className={({ selected }) =>
            classNames(
              'text-gray-80 cursor-pointer outline-none w-full flex items-center justify-between rounded hover:bg-gray-10 text-sm lg:text-base p-2 lg:p-3',
              {
                'bg-purple-10 !text-purple-90 hover:bg-purple-10': selected,
              },
            )
          }
        >
          {({ selected }) => (
            <>
              <span className="truncate capitalize select-none pointer-events-none">
                {option.display}
              </span>
              {selected && (
                <span className="w-4 h-4 shrink-0 mr-1" aria-hidden>
                  <CircleTick />
                </span>
              )}
            </>
          )}
        </Listbox.Option>
      ))}
    </>
  )
}
