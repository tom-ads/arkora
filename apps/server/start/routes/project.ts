import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProjectController.index')
  Route.post('/', 'ProjectController.create')
  Route.get('/:project', 'ProjectController.view').where('project', Route.matchers.number())
})
  .prefix('/projects')
  .middleware(['auth', 'subdomain'])
