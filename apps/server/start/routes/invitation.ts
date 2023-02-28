import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/verify', 'InvitationController.verify').middleware('blockAuth')

    Route.group(() => {
      Route.post('/', 'InvitationController.create')
      Route.post('/resend', 'InvitationController.resend')
    }).middleware(['auth', 'subdomain'])
  }).prefix('/invitations')
}).prefix('/auth')
