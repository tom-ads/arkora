import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TimeEntryController.index')
})
  .prefix('/entries')
  .middleware(['auth', 'subdomain'])
