type GetBudgetsRequest = Partial<{
  project_id: number
  user_id: number
  include_project: boolean
  include_expenditure: boolean
}>

export default GetBudgetsRequest
