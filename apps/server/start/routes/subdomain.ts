import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'SubdomainController.checkSubdomain')
    }).prefix('/subdomain')
  }).prefix('/v1')
}).prefix('/api')
