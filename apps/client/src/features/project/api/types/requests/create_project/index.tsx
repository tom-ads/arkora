type CreateProjectRequest = {
  name: string
  client_id: number
  show_cost: boolean
  private: boolean
  team: Array<number>
}

export default CreateProjectRequest
