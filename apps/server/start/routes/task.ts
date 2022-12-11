import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TaskController.index')
})
  .prefix('/tasks')
  .middleware(['auth', 'subdomain'])
