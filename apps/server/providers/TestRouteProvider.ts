import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
| ## Only used in testing. ##
*/
export default class TestRouteProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { default: Route } = await import('@ioc:Adonis/Core/Route')
    Route.get('/test-subdomain', async () => 'Hello world').middleware('subdomain')
  }
}
