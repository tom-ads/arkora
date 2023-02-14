import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TimerController.index')
  Route.post('/', 'TimerController.create')

  Route.put('/stop', 'TimerController.stopTimer')
  Route.put('/start', 'TimerController.startTimer')

  Route.group(() => {
    Route.delete('/', 'TimerController.delete')
  })
    .prefix(':timeEntryId')
    .where('timeEntry', Route.matchers.number())
})
  .prefix('/timers')
  .middleware(['auth', 'subdomain'])
