import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/', 'AuthController.register')
    Route.post('/details', 'AuthController.verifyDetails')
    Route.post('/organisation', 'AuthController.verifyOrganisation')
  }).prefix('/register')
}).prefix('/auth')
