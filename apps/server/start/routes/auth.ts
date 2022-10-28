import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/details', 'AuthController.verifyDetails')
  }).prefix('/register')
}).prefix('/auth')
