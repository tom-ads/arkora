import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'TimerController.create')
})
  .prefix('/timers')
  .middleware(['auth', 'subdomain'])
