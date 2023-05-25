import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    // Budgets
    Route.group(() => {
      Route.get('/', 'BudgetController.index')
      Route.post('/', 'BudgetController.create')

      // Budget
      Route.group(() => {
        Route.get('/', 'BudgetController.view')
        Route.delete('/', 'BudgetController.delete')
        Route.put('/', 'BudgetController.update')

        // Budget Tasks
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

        // Budget Members
        Route.group(() => {
          Route.get('/', 'BudgetMemberController.index')
          Route.post('/', 'BudgetMemberController.create')

          Route.group(() => {
            Route.delete('/', 'BudgetMemberController.delete')
          })
            .prefix(':userId')
            .where('users', Route.matchers.number())
        }).prefix('/members')

        // Budget Notes
        Route.group(() => {
          Route.post('/', 'BudgetNoteController.create')
          Route.get('/', 'BudgetNoteController.index')

          Route.group(() => {
            Route.get('/', 'BudgetNoteController.view')
            Route.put('/', 'BudgetNoteController.update')
            Route.delete('/', 'BudgetNoteController.delete')
          })
            .prefix(':noteId')
            .where('budget_notes', Route.matchers.number())
        }).prefix('/notes')
      })
        .prefix(':budgetId')
        .where('budget', Route.matchers.number())
    })
      .prefix('/budgets')
      .middleware(['auth', 'verifyTenant'])
  }).prefix('/v1')
}).prefix('/api')
