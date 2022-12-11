import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'BudgetController.index')
})
  .prefix('/budgets')
  .middleware(['auth', 'subdomain'])
