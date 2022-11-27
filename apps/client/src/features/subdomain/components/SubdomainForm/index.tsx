import { Button, Form, FormInput } from '@/components'
import FormErrorMessage from '@/components/Forms/ErrorMessage'
import { setOrganisation } from '@/stores/slices/organisation'
import { useDispatch } from 'react-redux'
import * as z from 'zod'
import { useLazyCheckSubdomainQuery } from '../../api'

const SubdomainFormSchema = z.object({
  subdomain: z.string().min(1, { message: 'Organisation domain is required' }),
})

type FormFields = {
  subdomain: string
}

export const SubdomainForm = (): JSX.Element => {
  const dispatch = useDispatch()

  const [trigger, { isLoading, data }] = useLazyCheckSubdomainQuery()

  const handleSubmit = async (data: FormFields) => {
    await trigger(data)
      .unwrap()
      .then((response) => {
        if (response.exists) {
          dispatch(setOrganisation({ ...response.organisation }))
          window.location.host = `${data.subdomain}.${import.meta.env.VITE_ARKORA_STATIC_HOSTNAME}`
        }
      })
  }

  return (
    <Form<FormFields, typeof SubdomainFormSchema>
      className="gap-4"
      onSubmit={handleSubmit}
      validationSchema={SubdomainFormSchema}
      defaultValues={{ subdomain: '' }}
    >
      {({ formState: { errors } }) => (
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <FormInput
                name="subdomain"
                placeHolder="domain"
                error={!!errors.subdomain || (data?.exists !== undefined ? !data?.exists : false)}
              />
              <p className="text-purple-90 text-2xl">.arkora.co.uk</p>
            </div>
            {(errors.subdomain?.message || data?.exists !== undefined ? !data?.exists : false) && (
              <FormErrorMessage size="sm">
                {errors.subdomain?.message ?? 'Organisation does not exist'}
              </FormErrorMessage>
            )}
          </div>

          <Button className="mt-6" type="submit" isLoading={isLoading} size="sm" block>
            Continue
          </Button>
        </>
      )}
    </Form>
  )
}
