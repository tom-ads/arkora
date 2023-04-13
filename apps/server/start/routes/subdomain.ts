import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'SubdomainsController.checkSubdomain')
    }).prefix('/subdomain')
  }).prefix('/v1')
}).prefix('/api')
