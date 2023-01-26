import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'BudgetController.index')
  Route.post('/', 'BudgetController.create')
})
  .prefix('/budgets')
  .middleware(['auth', 'subdomain'])
