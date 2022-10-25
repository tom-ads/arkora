import { Button, Form, FormInput } from '@/components'
import { FormEvent, FormEventHandler } from 'react'
import * as z from 'zod'
import { useGetSubdomainQuery, useLazyGetSubdomainQuery } from '../../api'

const SubdomainFormSchema = z.object({
  subdomain: z.string(),
})

type FormFields = {
  subdomain: string
}

export const SubdomainForm = (): JSX.Element => {
  const [trigger] = useLazyGetSubdomainQuery()

  const handleSubmit = (data: FormFields) => {
    trigger(data)
  }
  return (
    <Form<FormFields, typeof SubdomainFormSchema>
      onSubmit={handleSubmit}
      validationSchema={SubdomainFormSchema}
    >
      {({ register }) => (
        <>
          <div className="flex items-center gap-3">
            <FormInput placeHolder="domain" size="md" {...register('subdomain')} />
            <p className="text-purple-90 text-2xl">.arkora.co.uk</p>
          </div>
          <Button type="submit" block>
            Continue
          </Button>
        </>
      )}
    </Form>
  )
}
