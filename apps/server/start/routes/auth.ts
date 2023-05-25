import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.group(() => {
        Route.post('/login', 'AuthController.login')
        Route.post('/forgot-password', 'AuthController.forgotPassword')
        Route.post('/reset-password', 'AuthController.resetPassword')

        Route.group(() => {
          Route.post('/', 'AuthController.register')
          Route.post('/details', 'AuthController.verifyDetails')
          Route.post('/organisation', 'AuthController.verifyOrganisation')
        }).prefix('/register')
      })

      Route.group(() => {
        Route.get('/session', 'AuthController.session')
        Route.post('/logout', 'AuthController.logout')
        Route.post('/change-password', 'AuthController.changePassword')
      }).middleware('auth')
    }).prefix('/auth')
  }).prefix('/v1')
}).prefix('/api')
