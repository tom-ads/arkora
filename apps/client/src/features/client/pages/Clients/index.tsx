import { Card, Page, PageContent, PageHeader, PageTitle } from '@/components'

export const ClientsPage = (): JSX.Element => {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Clients</PageTitle>
      </PageHeader>
      <PageContent>
        <Card>
          <p>Clients page</p>
        </Card>
      </PageContent>
    </Page>
  )
}
