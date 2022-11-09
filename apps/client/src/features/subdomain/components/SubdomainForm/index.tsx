import { Button, Form, FormInput } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import * as z from 'zod'
import { useLazyVerifySubdomainQuery } from '../../api'

const SubdomainFormSchema = z.object({
  subdomain: z.string(),
})

type FormFields = {
  subdomain: string
}

export const SubdomainForm = (): JSX.Element => {
  const [trigger, { isError }] = useLazyVerifySubdomainQuery()

  const handleSubmit = (data: FormFields) => {
    trigger(data)
  }

  return (
    <Form<FormFields, typeof SubdomainFormSchema>
      className="gap-4"
      onSubmit={handleSubmit}
      defaultValues={{ subdomain: '' }}
    >
      {() => (
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <FormInput name="subdomain" placeHolder="domain" size="md" error={isError} />
              <p className="text-purple-90 text-2xl">.arkora.co.uk</p>
            </div>
            {isError && <FormErrorMessage>Organisation does not exist</FormErrorMessage>}
          </div>

          <Button className="mt-6" type="submit" block>
            Continue
          </Button>
        </>
      )}
    </Form>
  )
}
