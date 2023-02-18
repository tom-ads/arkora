import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/verifyInvitation', 'AuthController.verifyInvitation')

    Route.group(() => {
      Route.post('/', 'AuthController.register')
      Route.post('/details', 'AuthController.verifyDetails')
      Route.post('/organisation', 'AuthController.verifyOrganisation')
    }).prefix('/register')
  })
    .prefix('/auth')
    .middleware('blockAuth')

  Route.get('/session', 'AuthController.session').prefix('/auth').middleware('auth')
  Route.post('/resendInvitation', 'AuthController.resendInvitation').middleware([
    'auth',
    'subdomain',
  ])
})
