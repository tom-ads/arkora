import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'AccountController.index')
      Route.get('/insights', 'AccountController.insights')

      Route.group(() => {
        Route.get('/', 'AccountController.view')
        Route.put('/', 'AccountController.update')
        Route.delete('/', 'AccountController.delete')
      })
        .prefix(':userId')
        .where('user', Route.matchers.number())
    })
      .prefix('/accounts')
      .middleware(['verifyTenant', 'auth'])
  }).prefix('/v1')
}).prefix('/api')
