import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'TaskController.index')
    })
      .prefix('/tasks')
      .middleware(['verifyTenant', 'auth'])
  }).prefix('/v1')
}).prefix('/api')
