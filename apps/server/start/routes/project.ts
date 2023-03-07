import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProjectController.index')
  Route.post('/', 'ProjectController.create')

  Route.group(() => {
    Route.get('/', 'ProjectController.view')
    Route.put('/', 'ProjectController.update')
    Route.delete('/', 'ProjectController.delete')

    Route.get('/insights', 'ProjectController.insights')
  })
    .prefix(':projectId')
    .where('project', Route.matchers.number())
})
  .prefix('/projects')
  .middleware(['auth', 'subdomain'])
