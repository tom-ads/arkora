import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TimesheetController.index')
})
  .prefix('/timesheets')
  .middleware(['auth', 'subdomain'])
