import { Button, Form, FormInput } from '@/components'

export const SubdomainForm = (): JSX.Element => {
  return (
    <Form>
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
