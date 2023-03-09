import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TimerController.index')
  Route.post('/', 'TimerController.create')

  Route.put('/stop', 'TimerController.stopTimer')

  Route.group(() => {
    Route.put('/start', 'TimerController.startTimer')
  })
    .prefix(':timerId')
    .where('time_entries', Route.matchers.number())
})
  .prefix('/timers')
  .middleware(['auth', 'subdomain'])
