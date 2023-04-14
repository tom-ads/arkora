import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'TimesheetController.index')
      Route.get('/', 'TimesheetController.view')
        .prefix(':userId')
        .where('users', Route.matchers.number())
    })
      .prefix('/timesheets')
      .middleware(['auth', 'verifyTenant'])
  }).prefix('/v1')
}).prefix('/api')
