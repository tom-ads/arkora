import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProjectController.index')
})
  .prefix('/projects')
  .middleware(['auth', 'subdomain'])
