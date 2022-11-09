import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'SubdomainsController.checkSubdomain')
}).prefix('/subdomain')
