declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    password(): Rule
    currencyCode(): Rule
    workDays(): Rule
    budgetName(projectId: number, exceptCurrentName?: boolean): Rule
    budgetTaskName(budgetId: number): Rule
    organisationProject(organisationId: number): Rule
    uniqueProjectName(organisationId: number): Rule
    organisationClient(organisationId: number): Rule
    organisationEmail(organisationId: number, authEmail: string): Rule
  }
}
