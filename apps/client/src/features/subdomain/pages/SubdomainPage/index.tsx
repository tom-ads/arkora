import { ArkoraLogo, InlineLink } from '@/components'
import { SubdomainForm } from '../../components/SubdomainForm'

export const SubdomainPage = (): JSX.Element => {
  return (
    <div className="pb-4 flex flex-col justify-center w-full">
      <div className="pb-10">
        <div className="flex flex-col items-center gap-2 pb-3">
          <ArkoraLogo className="w-40 h-40" />
          <p className="text-[2.5rem] text-gray-100 font-istokWeb font-normal">Arkora</p>
        </div>
      </div>

      <div className="w-full mb-9">
        <p className="text-gray-60 align-baseline">Enter your organisations domain</p>
      </div>

      <SubdomainForm />

      <div className="w-full text-end mt-3">
        <span className="text-gray-80 text-base">
          Need to{' '}
          <InlineLink className="font-medium" to="/register">
            Register?
          </InlineLink>
        </span>
      </div>
    </div>
  )
}
