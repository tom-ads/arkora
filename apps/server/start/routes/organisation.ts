import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.put('/', 'OrganisationController.update')
    Route.delete('/', 'OrganisationController.delete')
  })
    .prefix(':organisationId')
    .where('organisations', Route.matchers.number())
})
  .prefix('/organisations')
  .middleware(['auth', 'subdomain'])
