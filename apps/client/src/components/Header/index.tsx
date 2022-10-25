import { ArkoraLogo } from '../Icons'

export const Header = (): JSX.Element => {
  return (
    <>
      <div className="w-full bg-white">
        <div className="mx-9 py-4">
          <div className="flex items-center gap-2">
            <ArkoraLogo className="w-[38px] h-[39px]" />
            <p className="text-2xl text-gray-100 font-istokWeb font-normal">Arkora</p>
          </div>
        </div>
      </div>
    </>
  )
}
