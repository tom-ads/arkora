import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.group(() => {
        Route.post('/verify', 'InvitationController.verify').middleware('blockAuth')

        Route.group(() => {
          Route.post('/', 'InvitationController.create')
          Route.post('/resend', 'InvitationController.resend')
        }).middleware(['verifyTenant', 'auth'])
      }).prefix('/invitations')
    }).prefix('/auth')
  }).prefix('/v1')
}).prefix('/api')
