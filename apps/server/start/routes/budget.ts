import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'BudgetController.index')
  Route.post('/', 'BudgetController.create')

  Route.group(() => {
    Route.get('/', 'BudgetController.view')
    Route.delete('/', 'BudgetController.delete')
    Route.put('/', 'BudgetController.update')

    Route.group(() => {
      Route.get('/', 'BudgetTaskController.index')
      Route.post('/', 'BudgetTaskController.create')

      Route.group(() => {
        Route.get('/', 'BudgetTaskController.view')
        Route.put('/', 'BudgetTaskController.update')
        Route.delete('/', 'BudgetTaskController.delete')
      })
        .prefix(':taskId')
        .where('tasks', Route.matchers.number())
    }).prefix('/tasks')
  })
    .prefix(':budgetId')
    .where('budget', Route.matchers.number())
})
  .prefix('/budgets')
  .middleware(['auth', 'subdomain'])
