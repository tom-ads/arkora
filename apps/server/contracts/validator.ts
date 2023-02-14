declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    password(): Rule
    currencyCode(): Rule
    workDays(): Rule
    budgetName(projectId: number, exceptCurrentName?: boolean): Rule
    organisationProject(organisationId: number): Rule
  }
}
