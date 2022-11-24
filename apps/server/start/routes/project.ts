import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProjectController.index')
  Route.post('/', 'ProjectController.create')
})
  .prefix('/projects')
  .middleware(['auth', 'subdomain'])
