declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    password(): Rule
    currencyCode(): Rule
    workDays(): Rule
  }
}
