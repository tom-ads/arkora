import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'AccountController.index')
})
  .prefix('/accounts')
  .middleware(['auth', 'subdomain'])
