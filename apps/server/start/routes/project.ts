import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    // Projects
    Route.group(() => {
      Route.get('/', 'ProjectController.index')
      Route.post('/', 'ProjectController.create')

      // Project
      Route.group(() => {
        Route.get('/', 'ProjectController.view')
        Route.put('/', 'ProjectController.update')
        Route.delete('/', 'ProjectController.delete')

        Route.get('/insights', 'ProjectController.insights')

        // Project Members
        Route.group(() => {
          Route.get('/', 'ProjectMemberController.index')
          Route.post('/', 'ProjectMemberController.create')

          Route.group(() => {
            Route.delete('/', 'ProjectMemberController.delete')
          })
            .prefix(':memberId')
            .where('user', Route.matchers.number())
        }).prefix('/members')
      })
        .prefix(':projectId')
        .where('project', Route.matchers.number())
    })
      .prefix('/projects')
      .middleware(['auth', 'verifyTenant'])
  }).prefix('/v1')
}).prefix('/api')
