import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'ClientController.index')
      Route.post('/', 'ClientController.create')

      Route.group(() => {
        Route.get('/', 'ClientController.view')
        Route.delete('/', 'ClientController.delete')
        Route.put('/', 'ClientController.update')
      })
        .prefix(':clientId')
        .where('client', Route.matchers.number())
    })
      .prefix('/clients')
      .middleware(['auth', 'verifyTenant'])
  }).prefix('/v1')
}).prefix('/api')
