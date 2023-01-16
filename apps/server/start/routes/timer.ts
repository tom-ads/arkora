import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'TimerController.create')

  Route.put('/stop', 'TimerController.stopTimer')
  Route.put('/start', 'TimerController.startTimer')
})
  .prefix('/timers')
  .middleware(['auth', 'subdomain'])
