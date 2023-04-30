import { Button, HouseIcon } from '@/components'

export const NotFoundPage = (): JSX.Element => {
  const handleRedirect = () => {
    window.location.host = import.meta.env.VITE_ARKORA_STATIC_HOSTNAME
  }

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="flex justify-center items-center w-full px-6 py-14 bg-white rounded shadow-glow max-w-2xl">
        <div className="max-w-[360px] flex flex-col items-center py-6">
          <div className="bg-purple-10 text-purple-90 h-14 w-14 rounded-full place-content-center grid mb-4">
            <span className="w-7 h-7">
              <HouseIcon />
            </span>
          </div>
          <p className="text-gray-100 font-semibold text-[20px] text-center">No Organisation</p>
          <div className="w-7 h-[2px] bg-purple-90 my-2"></div>
          <p className="text-gray-80 text-base text-center whitespace-normal mb-10">
            This organisation has not been registered with Arkora. If this is a mistake, please
            contact our support team.
          </p>
          <Button size="xs" onClick={handleRedirect}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
