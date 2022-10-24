import { ArkoraLogo, InlineLink } from '@/components'
import { SubdomainForm } from '../components/SubdomainForm'

export const SubdomainPage = (): JSX.Element => {
  return (
    <div className="max-w-[500px] px-8 pb-28 mx-auto h-full flex flex-col items-center justify-center">
      <div className="pb-10">
        <div className="flex flex-col items-center gap-2 pb-3">
          <ArkoraLogo className=" w-40 h-40" />
          <p className="text-[2.5rem] text-gray-100 font-istokWeb font-normal">Arkora</p>
        </div>
      </div>

      <div className="w-full mb-9">
        <p className="text-gray-60 align-baseline">Enter your organisations domain</p>
      </div>

      <SubdomainForm />

      <div className="flex justify-end w-full">
        <span className="text-gray-80 text-base">
          Need to <InlineLink to="/register">Register?</InlineLink>
        </span>
      </div>
    </div>
  )
}
