import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'TimeEntryController.index')

      Route.group(() => {
        Route.get('/', 'TimeEntryController.view')
        Route.delete('/', 'TimeEntryController.delete')
        Route.put('/', 'TimeEntryController.update')
      })
        .prefix(':entryId')
        .where('time_entries', Route.matchers.number())
    })
      .prefix('/entries')
      .middleware(['verifyTenant', 'auth'])
  }).prefix('/v1')
}).prefix('/api')
