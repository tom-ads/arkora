import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ClientController.index')
})
  .prefix('/clients')
  .middleware(['auth', 'subdomain'])
