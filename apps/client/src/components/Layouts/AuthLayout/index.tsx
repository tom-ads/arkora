import { Outlet } from 'react-router-dom'
import { ArkoraLogo } from '@/components'

export const AuthLayout = (): JSX.Element => {
  return (
    <div className="relative flex min-h-full">
      <div className="w-full xl:w-2/3 bg-white sm:px-[42px] px-4 flex flex-col">
        <div className="items-center gap-2 pb-3 hidden sm:flex pt-12">
          <ArkoraLogo className="w-12 h-12" />
          <p className="text-2xl text-gray-100 font-istokWeb font-normal">Arkora</p>
        </div>

        <main className="max-w-[500px] px-8 mx-auto flex-grow flex">
          <Outlet />
        </main>
      </div>

      <div className="w-1/3 hidden xl:block sticky overflow-hidden top-0">
        <div className="absolute inset-0 from-purple-90 bg-gradient-radial"></div>
        <ArkoraLogo className="max-w-[18.375rem] lg:max-h-[18.875rem] xl:max-w-[22.375rem] xl:max-h-[22.875rem] absolute -top-[4.3125rem] left-7" />
        <ArkoraLogo className="lg:max-w-[14.1875rem] lg:max-h-[14.5rem] absolute -right-[6.5625rem] top-48" />
        <ArkoraLogo className="lg:max-w-[14.1875rem] lg:max-h-[14.5rem] absolute -left-16 bottom-[23.4375rem]" />
        <ArkoraLogo className="max-w-[18.375rem] lg:max-h-[18.875rem] xl:max-w-[22.375rem] xl:max-h-[22.875rem] absolute -bottom-[7.1875rem] -right-[6.5625rem]" />
      </div>
    </div>
  )
}
