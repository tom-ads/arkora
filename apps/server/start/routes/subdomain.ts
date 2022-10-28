import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:subdomain', 'SubdomainsController.verifySubdomain')
}).prefix('/subdomain')
