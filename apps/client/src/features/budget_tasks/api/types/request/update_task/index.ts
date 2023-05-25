type UpdateBudgetTaskRequest = {
  budgetId: number | string
  taskId: number | string
  name: string
  isBillable: boolean
}

export default UpdateBudgetTaskRequest
