import Organisation from 'App/Models/Organisation'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    organisation: Organisation | null
  }
}
