import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'TimerController.index')
      Route.post('/', 'TimerController.create')

      Route.put('/stop', 'TimerController.stopTimer')

      Route.group(() => {
        Route.put('/start', 'TimerController.startTimer')
      })
        .prefix(':entryId')
        .where('time_entries', Route.matchers.number())
    })
      .prefix('/timers')
      .middleware(['auth', 'verifyTenant'])
  }).prefix('/v1')
}).prefix('/api')
