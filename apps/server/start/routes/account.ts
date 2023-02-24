import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'AccountController.index')

  Route.group(() => {
    Route.get('/', 'AccountController.view')
    Route.put('/', 'AccountController.update')
    Route.delete('/', 'AccountController.delete')
  })
    .prefix(':userId')
    .where('user', Route.matchers.number())
})
  .prefix('/accounts')
  .middleware(['auth', 'subdomain'])
