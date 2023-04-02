import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TimesheetController.index')
  Route.get('/', 'TimesheetController.view')
    .prefix(':userId')
    .where('users', Route.matchers.number())
})
  .prefix('/timesheets')
  .middleware(['auth', 'subdomain'])
