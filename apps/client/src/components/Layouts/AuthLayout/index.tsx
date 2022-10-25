import { Outlet } from 'react-router-dom'
import { ArkoraLogo } from '@/components'

export const AuthLayout = (): JSX.Element => {
  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 from-purple-90 -left-96 bg-gradient-radial"></div>
      <div className="fixed w-1/3 inset-y-0 h-full right-0">
        <ArkoraLogo className="w-[18.375rem] lg:h-[18.875rem] xl:w-[22.375rem] xl:h-[22.875rem] absolute -top-[4.3125rem] left-7" />
        <ArkoraLogo className="lg:w-[14.1875rem] lg:h-[14.5rem] absolute -right-[6.5625rem] top-48" />
        <ArkoraLogo className="lg:w-[14.1875rem] lg:h-[14.5rem] absolute -left-16 bottom-[23.4375rem]" />
        <ArkoraLogo className="w-[18.375rem] lg:h-[18.875rem] xl:w-[22.375rem] xl:h-[22.875rem] absolute -bottom-[7.1875rem] -right-[6.5625rem]" />
      </div>

      <div className="fixed w-full lg:w-2/3 bg-gray-20 inset-y-0 h-full py-12 sm:px-[42px] px-4">
        <div className="flex items-center gap-2 pb-3">
          <ArkoraLogo className="w-12 h-12" />
          <p className="text-2xl text-gray-100 font-istokWeb font-normal">Arkora</p>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
