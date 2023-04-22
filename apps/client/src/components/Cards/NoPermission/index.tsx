import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { KeyIcon } from '@/components/Icons'
import { useNavigate } from 'react-router-dom'

type NoPermissionCardProps = {
  title?: string
  description?: string
  redirectTo?: string
  redirectTxt?: string
}

export const NoPermissionCard = ({
  title,
  description,
  redirectTo,
  redirectTxt,
}: NoPermissionCardProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Card className="min-h-[600px] grid place-content-center">
      <div className="max-w-sm flex flex-col items-center">
        <KeyIcon className="w-32 h-32 text-purple-90 mb-6" />
        <div className="text-center space-y-1">
          <p className="text-gray-100 font-semibold text-2xl">{title || 'No Permissions'}</p>
          <p className="text-gray-80 text-center">
            {description ||
              `You lack the permission to view this resource, please contact your administrator, if
        you think this is an error.`}
          </p>
        </div>

        {redirectTo && (
          <Button onClick={() => navigate(redirectTo)} size="xs" className="!mt-10" block>
            {redirectTxt || 'Back to home'}
          </Button>
        )}
      </div>
    </Card>
  )
}
