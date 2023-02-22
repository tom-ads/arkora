import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login')

    Route.group(() => {
      Route.post('/', 'AuthController.register')
      Route.post('/details', 'AuthController.verifyDetails')
      Route.post('/organisation', 'AuthController.verifyOrganisation')
    }).prefix('/register')
  }).middleware('blockAuth')

  Route.get('/session', 'AuthController.session').middleware('auth')
}).prefix('/auth')
