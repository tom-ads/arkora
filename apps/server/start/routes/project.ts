import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProjectController.index')
  Route.post('/', 'ProjectController.create')

  Route.group(() => {
    Route.get('/', 'ProjectController.view')
    Route.delete('/', 'ProjectController.delete')
  })
    .prefix(':project')
    .where('project', Route.matchers.number())
})
  .prefix('/projects')
  .middleware(['auth', 'subdomain'])
